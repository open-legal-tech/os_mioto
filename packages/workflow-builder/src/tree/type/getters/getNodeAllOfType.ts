import { pickBy } from "remeda";
import type { TNodeId } from "../../id";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const getNodeAllOfType =
  (tree: TTree) =>
  <TType extends INode>(type?: TType["type"]) => {
    return pickBy(tree.nodes, (node) => node.type === type) as Record<
      TNodeId,
      TType
    >;
  };
