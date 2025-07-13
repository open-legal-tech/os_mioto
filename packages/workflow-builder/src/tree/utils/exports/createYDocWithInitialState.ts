import { proxy } from "valtio";
import * as Y from "yjs";
import { bind } from "./bind";

export function createYDocWithInitialState(data: any) {
  const yDoc = new Y.Doc();

  const yMap = yDoc.getMap("tree");
  const store = proxy(data);

  bind(store, yMap);

  return { store, yDoc, yMap };
}
