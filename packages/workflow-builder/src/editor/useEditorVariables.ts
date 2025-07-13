import { mapValues, pipe } from "remeda";
import { assertNode } from "../tree/createTreeClientWithPlugins";
import type { TNodeId } from "../tree/id";
import { useTree, useTreeClient } from "../tree/sync/state";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../variables/exports/types";
import {
  type Filters,
  filterVariables,
} from "../variables/utils/filterVariables";

export function useEditorVariables<
  TPrimitives extends PrimitiveVariable | IFileVariable | IRichTextVariable,
>(
  /**
   * @params excludeIds - Exclude variables by nodeId.
   * @params includeEmptyRecords - Include empty records. Defaults to false.
   */
  filters?: Filters<TPrimitives>,
) {
  const { nodePlugins } = useTreeClient();

  return useTree((treeClient) => {
    const nodeVariables = pipe(
      treeClient.nodes.get.all({ includeSystem: true }),
      mapValues((node) => {
        assertNode(node);

        const nodePlugin = nodePlugins[node.type];

        if (!nodePlugin) {
          throw new Error("Node plugin not found");
        }

        return nodePlugin.createVariable({ nodeId: node.id })(treeClient)
          .variable;
      }),
    );

    return pipe(nodeVariables, filterVariables(filters));
  });
}

export function useEditorVariable(id?: TNodeId) {
  const variables = useEditorVariables({ includeEmptyRecords: true });

  if (!id) return undefined;

  return variables[id];
}
