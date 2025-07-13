import * as Y from "yjs";
import type { TTree } from "../../type/type-classes/Tree";

export function convertBufferToTreeDoc(data: Buffer | Uint8Array) {
  const yDoc = new Y.Doc();
  const arrayData =
    data instanceof Buffer
      ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
      : data;

  Y.applyUpdate(yDoc, arrayData);

  const yMap = yDoc.getMap<TTree>("tree");

  return { yDoc, treeMap: yMap };
}
