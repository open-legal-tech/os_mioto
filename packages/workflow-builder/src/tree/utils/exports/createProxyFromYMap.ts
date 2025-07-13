import { proxy } from "valtio/vanilla";
import type { Map as YMap } from "yjs";
import { bind } from "./bind";

export function createProxyFromYMap<TData extends Record<string, any>>(
  yMap: YMap<TData>,
  transactionOrigin?: string,
) {
  const store = proxy({} as TData);

  bind(store, yMap, {
    transactionOrigin,
  });

  return { store };
}
