import type { TNodeId } from "../../id";
import { TreeEvent } from "../TreeEventEmitter";
import { getEdgesByNode } from "../getters/getEdgesByNode";
import { getNodeSingle } from "../getters/getNodeSingle";
import type { TTree } from "../type-classes/Tree";
import { deleteEdges } from "./deleteEdges";

export const deleteNodes = (tree: TTree) => (ids: TNodeId[]) => {
  ids.forEach((id) => {
    const node = getNodeSingle(tree)(id);

    const edgesByTarget = getEdgesByNode(tree)(id)?.target;

    if (tree.startNode === id) {
      throw new Error(
        "Cannot delete start node. This should have been prevented earlier.",
      );
    }

    delete tree.nodes[id];

    deleteEdges(tree)([
      ...node.edges,
      ...(node.fallbackEdge ? [node.fallbackEdge] : []),
      ...Object.values(edgesByTarget ?? {}).map(({ id }) => id),
    ]);

    TreeEvent.emit("deleteNode", { nodeId: id });
  });
};
