"use server";

import { createYDocWithInitialState } from "@mioto/workflow-builder/tree-utils/createYDocWithInitialState";
import * as Y from "yjs";

export async function transform(json: string) {
  const data = JSON.parse(json);

  const { yDoc } = createYDocWithInitialState(data);

  return Y.encodeStateAsUpdate(yDoc);
}