import type { TEdgeId } from "../../id";
import { MissingTreeDataError } from "../errors/commonErrors";
import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";

export const getEdgeSingle =
  (tree: TTree) =>
  <TType extends IEdge>(id: TEdgeId, type?: TType["type"]) => {
    const edge = tree.edges[id];

    // If the edge is not defined we throw an error, because this should not be possible.
    // The id used to lookup the edge should come from the edges on the tree and not
    // from anywhere else. Looking up an id that does not exist indicates a clear
    // error somewhere.
    if (!edge) throw MissingTreeDataError(tree, "edges", id);

    // When lookin up a specific type of edge we treat a edge that is not of that type
    // like the edge does not exist. This also indicates a clear error somewhere, because
    // a plugin tried to access a edge that it should not have access to.
    if (type && edge.type !== type)
      throw MissingTreeDataError(tree, "edges", id);

    return edge as TType;
  };
