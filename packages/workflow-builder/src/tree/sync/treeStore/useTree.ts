"use client";

import { useTranslations } from "@mioto/locale";
import type { TranslationFn } from "@mioto/locale";
import { useSnapshot } from "valtio";
import type { XmlFragment, Map as YMap } from "yjs";
import type { TNodeId } from "../../id";
import { ReadOnlyTreeClient } from "../../type/treeClient";
import { useTreeContext } from "./TreeContext";

export const useTree = <TReturn>(
  selector: (treeClient: ReadOnlyTreeClient, t: TranslationFn) => TReturn,
) => {
  const t = useTranslations();
  const { tree, treeMap } = useTreeContext();

  const treeSnapshot = useSnapshot(tree);

  return selector(new ReadOnlyTreeClient(treeSnapshot, treeMap), t);
};

export const useEditorHistory = () => {
  const { history } = useTreeContext();
  return useSnapshot(history);
};

export const getNodeFromYDoc = (yMap: YMap<any>, nodeId: TNodeId) => {
  const nodes = yMap.get("nodes");

  return nodes.get(nodeId);
};

export const getNodeContentFromYDoc = (
  yMap: YMap<any>,
  nodeId: TNodeId,
  fragmentName = "yContent",
) => {
  const node = getNodeFromYDoc(yMap, nodeId);

  return node.get(fragmentName) as XmlFragment;
};
