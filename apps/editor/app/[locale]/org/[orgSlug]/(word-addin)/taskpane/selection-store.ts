import { proxy } from "valtio";

export const selectionStore = proxy({ contentControlId: undefined } as {
  contentControlId: string | undefined;
});
