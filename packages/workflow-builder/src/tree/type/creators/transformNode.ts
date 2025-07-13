import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

/**
 * Used to transform an existing edge into another.
 */
export const transformNode =
  (_: TTree) =>
  <TOldType extends INode, TNewType extends INode>(
    node: Omit<TOldType, "version" | "pluginVersion" | "type">,
    data: Omit<TNewType, "id">,
  ) => {
    return {
      ...data,
      id: node.id,
    } as TNewType;
  };
