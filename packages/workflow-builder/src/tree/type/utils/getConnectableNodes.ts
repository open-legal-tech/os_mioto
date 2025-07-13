import { pipe } from "remeda";
import { filter } from "remeda";
import { map } from "remeda";
import { values } from "remeda";
import type { TNodeId } from "../../id";
import { getNodeAll } from "../getters/getNodeAll";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";
import { getChildren } from "./getChildren";
import { getPathsTo } from "./getPaths";

export const getConnectableNodes =
  (tree: TTree) =>
  (nodeId: TNodeId): TNodeId[] => {
    if (!tree.nodes) return [];

    const nodesOnPath = getPathsTo(tree)(nodeId).flatMap((path) => path);
    const isPreviousNode = (node: INode) => nodesOnPath.includes(node.id);
    const connectedNodes = getChildren(tree)(nodeId);

    return pipe(
      getNodeAll(tree)(),
      (x) => values(x),
      filter(
        (iteratedNode) =>
          // Filter out the node itself and all the previous nodes that it is connected to
          iteratedNode.id !== nodeId &&
          !isPreviousNode(iteratedNode) &&
          !iteratedNode.isRemoved &&
          !connectedNodes.includes(iteratedNode.id),
      ),
      map((node) => node.id),
    );
  };
