import { getNodeAll } from "../getters/getNodeAll";
import type { INode } from "../plugin/NodePlugin";
import type { TNode } from "../type-classes/Node";
import type { TTree } from "../type-classes/Tree";

export type NewNodeData = Partial<Omit<TNode, "id">>;

/**
 * You almost certainly do not want to use this directly, but use a plugin instead.
 * This is a low-level function that is used by plugins to create a new node.
 * @param data must include the base properties of a node
 * @param type defaults to question
 * @returns the data merged with a unique id
 */
export const createNode =
  (tree: TTree) =>
  <TNodeType extends INode = INode>({
    position = { x: 0, y: 0 },
    type,
    name,
    final = false,
    edges = [],
    fallbackEdge = undefined,
    ...data
  }: Omit<
    TNodeType,
    "id" | "name" | "position" | "final" | "edges" | "fallbackEdge"
  > &
    Partial<
      Pick<TNodeType, "name" | "position" | "final" | "edges" | "fallbackEdge">
    >) => {
    const fallbackName = `Block ${
      Object.values(getNodeAll(tree)()).length + 1
    }`;

    return {
      id: `node_${crypto.randomUUID()}`,
      position,
      type,
      name: name ?? fallbackName,
      final,
      edges,
      fallbackEdge,
      ...data,
    } satisfies INode;
  };
