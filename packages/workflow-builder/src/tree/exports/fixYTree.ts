import { Failure } from "@mioto/errors";
import { getTranslations } from "@mioto/locale/server";
import * as Y from "yjs";
import { convertBufferToTreeDoc } from "../utils/exports/convertBufferToTreeDoc";
import { createProxyFromYMap } from "../utils/exports/createProxyFromYMap";
import { autoFix } from "./autoFix";

/** Takes a yjs document and returns one with all migrations applied. */
export async function fixYTree(
  data: Uint8Array,
  onFix?: (document: Uint8Array) => Promise<void>,
) {
  const { treeMap, yDoc } = convertBufferToTreeDoc(data);
  const { store } = createProxyFromYMap(treeMap);
  const t = await getTranslations();

  const fixedTree = await autoFix({
    store,
    yMap: treeMap,
    t,
  });

  const status =
    fixedTree instanceof Failure
      ? "unfixable"
      : fixedTree !== true
        ? "fixed"
        : "no-fixes-necessary";

  const result = await new Promise<{
    document: Uint8Array;
    status: "fixed" | "no-fixes-necessary" | "unfixable";
    fixes: typeof fixedTree;
  }>((resolve) => {
    setTimeout(() => {
      resolve({
        document: Y.encodeStateAsUpdate(yDoc),
        status,
        fixes: fixedTree,
      });
    }, 50);
  });

  if (result.status === "fixed" && onFix) {
    await onFix(result.document);
  }

  return result;
}
