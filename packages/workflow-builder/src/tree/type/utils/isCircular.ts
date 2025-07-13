import type { IEdge } from "../plugin/EdgePlugin";
import type { TTree } from "../type-classes/Tree";
import { getPathsTo } from "./getPaths";

export const isCircular =
  (tree: TTree) =>
  ({ source, target }: Required<Pick<IEdge, "source" | "target">>) => {
    const nodesOnPaths = getPathsTo(tree)(source).flatMap((path) => path);

    if (nodesOnPaths.includes(target)) return true;

    return false;
  };
