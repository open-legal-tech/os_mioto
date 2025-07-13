import { fromEntries, isEmpty } from "remeda";
import type { TNodeId } from "../../id";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";
import { getNodeSingle } from "./getNodeSingle";

export const getNodeMany =
  (tree: TTree) =>
  <TType extends INode>(ids: TNodeId[], type?: TType["type"]) => {
    const nodes = fromEntries(
      ids.map((id) => [id, getNodeSingle(tree)(id, type)]),
    );

    if (isEmpty(nodes)) return undefined;

    return nodes as Record<TNodeId, TType>;
  };
