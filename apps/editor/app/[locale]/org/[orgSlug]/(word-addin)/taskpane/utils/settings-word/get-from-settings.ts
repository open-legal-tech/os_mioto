import { NODES_KEY } from "../../constants";

export function getFromSettings<T>(key: string = NODES_KEY): T | null {
  return Office.context.document.settings.get(key);
}
