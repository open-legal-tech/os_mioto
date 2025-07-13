import type { Map as YMap } from "yjs";
import type { TNodeId } from "../../id";

export const getYNode = (treeMap: YMap<any>) => (nodeId: TNodeId) => {
  return treeMap.get("nodes").get(nodeId) as YMap<any>;
};
