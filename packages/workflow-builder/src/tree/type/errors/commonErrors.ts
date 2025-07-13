import { FatalError } from "@mioto/errors";
import type { TTree } from "../type-classes/Tree";

export const InvalidTreeDataError = (entityName: string) =>
  new FatalError({
    code: "invalid_tree_data_error",
    debugMessage: `You tried to add an invalid ${entityName} to the tree. Make sure to create the ${entityName} with the respective create function, since there might be more happening in creation than simply producing the correct shape.`,
  });

export const MissingTreeDataError = (
  tree: TTree,
  entityName: string,
  id: string,
) =>
  new FatalError({
    code: "missing_tree_data",
    debugMessage: `The requested ${entityName} of id ${id} does not exist on the tree. Please review where the ${entityName} id is coming from. If you are actually unsure if the node exists check for that with the hasNode function on the treeClient.`,
    additionalData: { tree },
  });
