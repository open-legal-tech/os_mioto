import { proxy } from "valtio";
import { ySyncPluginKey } from "y-prosemirror";
import * as Y from "yjs";
import type { TTree } from "../../type/type-classes/Tree";
import { bind } from "../../utils/exports/bind";
import { convertBufferToTreeDoc } from "../../utils/exports/convertBufferToTreeDoc";

declare module "valtio" {
  function useSnapshot<T extends object>(p: T): T;
}

export function createTreeStore(id: string, initialTree?: TTree | string) {
  const transactionOrigin = `valtio for ${id}`;

  let yDoc: Y.Doc;
  let yMap: Y.Map<any>;
  let syncedStore: TTree;
  if (typeof initialTree === "string") {
    const buf = Buffer.from(initialTree, "base64");
    const { yDoc: doc, treeMap } = convertBufferToTreeDoc(buf);
    yDoc = doc;
    yMap = treeMap;

    syncedStore = proxy({} as TTree);
  } else {
    yDoc = new Y.Doc({ guid: id });
    yMap = yDoc.getMap("tree");
    syncedStore = proxy(initialTree);
  }

  const undoManager = new Y.UndoManager(yMap, {
    trackedOrigins: new Set([transactionOrigin, ySyncPluginKey, null]),
  });

  bind(syncedStore, yMap, {
    transactionOrigin,
  });

  const history = proxy({
    canUndo: undoManager.canUndo(),
    canRedo: undoManager.canRedo(),
  });

  const updateUndoRedo = () => {
    history.canUndo = undoManager.canUndo();
    history.canRedo = undoManager.canRedo();
  };

  undoManager.on("stack-item-added", updateUndoRedo);
  undoManager.on("stack-item-popped", updateUndoRedo);
  undoManager.on("stack-cleared", updateUndoRedo);
  undoManager.on("stack-item-updated", updateUndoRedo);

  return {
    id,
    tree: syncedStore,
    history,
    treeDoc: yDoc,
    treeMap: yMap,
    undoManager,
    undo: () => undoManager.undo(),
    redo: () => undoManager.redo(),
  };
}
