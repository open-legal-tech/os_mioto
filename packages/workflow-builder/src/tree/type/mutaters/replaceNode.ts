import { entries, keys } from "remeda";
import type { Map as YMap } from "yjs";
import type { TNodeId } from "../../id";
import { getNodeSingle } from "../getters/getNodeSingle";
import { getYNode } from "../getters/getYNode";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const replaceNode =
  (tree: TTree, treeMap: YMap<any>) => (nodeId: TNodeId, newNode: INode) => {
    const node = getNodeSingle(tree)(nodeId);

    // First we set all new values on the node
    entries(newNode).forEach(([key, value]) => {
      // We skip the id since we do not want to create a new node
      if (key === "id") return;
      // We handle all keys with a y at the start differently, since they are untracked
      // and inserted directly.
      if (key.startsWith("y")) {
        if (node[key] == null) {
          getYNode(treeMap)(nodeId).set(key, value);
        }

        return;
      }

      // Set the new value for each key.
      (node[key] as any) = value;
    });

    // Now we remove all data that does not belong to the current node.
    const newNodeKeys = keys(newNode);
    keys(node).forEach((key) => {
      if (!newNodeKeys.includes(key)) {
        getYNode(treeMap)(nodeId).delete(key);
      }
    });
  };
