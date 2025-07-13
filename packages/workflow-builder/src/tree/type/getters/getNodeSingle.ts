import { MissingTreeDataError } from "../errors/commonErrors";
import type { INode } from "../plugin/NodePlugin";
import type { TTree } from "../type-classes/Tree";

export const getNodeSingle =
  (tree: TTree) =>
  <TType extends INode>(id: TType["id"], type?: TType["type"]) => {
    const node = tree.nodes[id];

    // If the node is not defined we throw an error, because this should not be possible.
    // The id used to lookup the node should come from the nodes on the tree and not
    // from anywhere else. Looking up an id that does not exist indicates a clear
    // error somewhere.
    if (!node) throw MissingTreeDataError(tree, "node", id);

    // When lookin up a specific type of node we treat a node that is not of that type
    // like the node does not exist. This also indicates a clear error somewhere, because
    // a plugin tried to access a node that it should not have access to.
    if (type && node.type !== type)
      throw MissingTreeDataError(tree, "node", id);

    return node as TType;
  };
