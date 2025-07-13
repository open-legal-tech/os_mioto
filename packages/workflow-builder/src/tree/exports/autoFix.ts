import { Failure } from "@mioto/errors";
import type { TranslationFn } from "@mioto/locale";
import { P, match } from "ts-pattern";
import type { Map as YMap } from "yjs";
import type { z } from "zod";
import { createTreeClientPlugins } from "../createTreeClientWithPlugins";
import {
  type TEdgeId,
  type TId,
  type TNodeId,
  isEdgeId,
  isId,
  isNodeId,
} from "../id";
import { TreeClient } from "../type/treeClient";
import type { TTree } from "../type/type-classes/Tree";

function createFixMapResult(fixMap: Fixes) {
  const unfixable = Object.values(fixMap).filter(
    (fix) => fix?.type === "unfixable",
  );

  if (unfixable.length > 0)
    return new Failure({
      code: "unfixable_tree",
      parentError: unfixable,
    });

  return fixMap;
}

function createFixesFromIssues(issues: z.ZodIssue[]): Fixes {
  const fixes: Fixes = {};

  for (const issue of issues ?? []) {
    const id = issue.path.find((pathItem) => isId(pathItem)) as TId;

    if (!id) throw new Error(`Invalid issue ${JSON.stringify(issue)}`);

    if (fixes[id]) continue;

    fixes[id] = { issue, type: "no_fix", id };
  }

  return fixes;
}

export type Unfixable = {
  type: "unfixable";
  remainingIssues?: z.ZodIssue[];
  additionalData?: unknown;
  issue: z.ZodIssue;
  id?: string;
};

export type Fix = {
  type: "fix";
  userMessage?: string;
  issue: z.ZodIssue;
  id: string;
};

export type NoFix = {
  type: "no_fix";
  issue: z.ZodIssue;
  id: string;
};

export type Fixes = Record<string, Fix | Unfixable | NoFix>;

export type FixConfig = {
  store: TTree;
  yMap: YMap<any>;
  debug?: boolean;
  t: TranslationFn;
};

export async function autoFix({ store, yMap, t }: FixConfig) {
  const treeClient = new TreeClient(store, yMap);
  const { TreeType, nodePlugins, edgePlugins } =
    createTreeClientPlugins(treeClient);

  const tree = treeClient.get.tree();
  const parsedTree = tree
    ? TreeType.safeParse(tree)
    : { success: true, error: undefined, data: undefined };

  if (parsedTree.success || !parsedTree.error?.issues) return true;

  const fixes = createFixesFromIssues(parsedTree.error?.issues);

  for (const key in fixes) {
    const fix = fixes[key];
    if (!fix) return;

    const { type, id, issue } = fix;

    // If the issue is not a no_fix issue we do not have to fix it.
    if (type !== "no_fix") return;

    await match(issue)
      // Special case where an edge is left over
      .with(
        {
          path: P.when((path) => path[0] === "edges" && isEdgeId(path[1])),
          message: P.union(
            "Edge is not assigned to source nodes edges property.",
            "Edge is not assigned to source nodes fallbackEdge property.",
          ),
        },
        (issue) => {
          const edgeId = issue.path[1] as TEdgeId;

          const sourceNode = treeClient.nodes.get.single(
            treeClient.edges.get.single(edgeId).source,
          );

          if (sourceNode.version > 1) {
            treeClient.edges.delete([edgeId]);
          }
        },
      )
      .with(
        {
          path: P.when((path) => path[0] === "nodes" && isNodeId(path[1])),
        },
        async (issue) => {
          // We get the nodeId from the issue path
          const nodeId = issue.path[1] as TNodeId;

          if (!treeClient.nodes.has(nodeId)) {
            // If the tree does not have the node anymore we do not have to fix it.
            // This might be the result of another migration removing it.

            fixes[id] = {
              type: "fix",
              issue,
              id,
            };

            return;
          }

          // We get the node and the yEntity from the treeClient and yMap
          const nodeBeforeMigration = treeClient.nodes.get.single(nodeId);
          const yEntity = (yMap.get("nodes") as any).get(nodeId);

          try {
            // We run tree migrations on the node
            await treeClient.nodes.migrate(nodeBeforeMigration);
          } catch (error) {
            console.log(nodeBeforeMigration);
            console.error(error);
          }

          if (!treeClient.nodes.has(nodeId)) {
            // If after the migration the node does not exist anymore we consider this as a fix.
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // We get the node again after the migration
          const nodeAfterTreeMigration = treeClient.nodes.get.single(nodeId);

          // We validate the node again after the migration to see whether the issues
          // have been fixed
          const parsedMigrationResult = TreeType.shape.nodes.safeParse({
            [nodeAfterTreeMigration.id]: nodeAfterTreeMigration,
          });

          if (parsedMigrationResult.success) {
            // A successfull parse means we fixed it
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // If the parse fails we run the plugin migrations as well
          // @ts-expect-error - The type of the node is not known at this point, but it can
          // only be one of the types in the tree. Even if this is incorrect, the migration would fail.
          await nodePlugins[nodeAfterTreeMigration.type]?.migrate(
            treeClient,
            yMap,
            t,
          )(nodeAfterTreeMigration, yEntity);

          if (!treeClient.nodes.has(nodeId)) {
            // If after the migration the node does not exist anymore we consider this as a fix.
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // We get the node again after the migration
          const nodeAfterPluginMigration = treeClient.nodes.get.single(nodeId);

          // We validate the node again after the migration to see whether the issues
          // have been fixed
          const parsedPluginMigrationResult = TreeType.shape.nodes.safeParse({
            [nodeAfterPluginMigration.id]: nodeAfterPluginMigration,
          });

          if (parsedPluginMigrationResult.success) {
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // If we reach this point we have not fixed the node.
          fixes[id] = {
            type: "unfixable",
            issue,
            id,
          };

          return;
        },
      )
      .with(
        {
          path: P.when((path) => path[0] === "edges" && isEdgeId(path[1])),
        },
        async (issue) => {
          // We get the nodeId from the issue path
          const edgeId = issue.path[1] as TEdgeId;

          if (!treeClient.edges.has(edgeId)) {
            // If the tree does not have the node anymore we do not have to fix it.
            // This might be the result of another migration removing it.
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // We get the node and the yEntity from the treeClient and yMap
          const edgeBeforeMigration = treeClient.edges.get.single(edgeId);
          const yEntity = (yMap.get("nodes") as any).get(edgeId);

          // We run tree migrations on the node
          await treeClient.edges.migrate(edgeBeforeMigration);

          if (!treeClient.edges.has(edgeId)) {
            // If after the migration the node does not exist anymore we consider this as a fix.
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // We get the node again after the migration
          const edgeAfterTreeMigration = treeClient.edges.get.single(edgeId);

          // We validate the node again after the migration to see whether the issues
          // have been fixed
          const parsedMigrationResult = TreeType.shape.edges.safeParse({
            [edgeAfterTreeMigration.id]: edgeAfterTreeMigration,
          });

          if (parsedMigrationResult.success) {
            // A successfull parse means we fixed it
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // If the parse fails we run the plugin migrations as well
          // @ts-expect-error - The type of the edge is not known at this point, but it can
          // only be one of the types in the tree. Even if this is incorrect, the migration would fail.
          await edgePlugins[edgeAfterTreeMigration.type]?.migrate(
            treeClient,
            yMap,
            t,
          )(edgeAfterTreeMigration, yEntity);

          if (!treeClient.edges.has(edgeId)) {
            // If after the migration the node does not exist anymore we consider this as a fix.
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // We get the node again after the migration
          const edgeAfterPluginMigration = treeClient.edges.get.single(edgeId);

          // We validate the node again after the migration to see whether the issues
          // have been fixed
          const parsedPluginMigrationResult = TreeType.shape.edges.safeParse({
            [edgeAfterPluginMigration.id]: edgeAfterPluginMigration,
          });

          if (parsedPluginMigrationResult.success) {
            fixes[id] = {
              type: "fix",
              issue,
              id,
            };
            return;
          }

          // If we reach this point we have not fixed the node.
          fixes[id] = {
            type: "unfixable",
            issue,
            id,
          };
          return;
        },
      )
      .otherwise((issue) => {
        throw new Error(`Invalid issue ${JSON.stringify(issue)}`);
      });
  }

  return createFixMapResult(fixes);
}
