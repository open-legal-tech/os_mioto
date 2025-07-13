import type { TCondition } from "@mioto/workflow-builder/edge-plugin/complex-logic/type";
import type { Variable } from "@mioto/workflow-builder/variables/types";
import { omit } from "remeda";
import { proxy, subscribe, useSnapshot } from "valtio";
import {
  insertConditionContentControl,
  insertTextVarContentControl,
} from "./utils";
import { getFromSettings, saveToSettings } from "./utils/settings-word";

export const settingsKey = "mioto-add-in-store";

type TTaskPaneStore = Record<string, any> & {
  synced: boolean;
  conditions: any[];
};

export const store = proxy<TTaskPaneStore>({
  synced: false,
  conditions: [],
});

subscribe(store, () => {
  if (store.synced) {
    saveToSettings(settingsKey, omit(store, ["synced"]));
  }
});

export function restoreStore() {
  const data = getFromSettings(settingsKey) as Record<string, any>;

  if (data != null) {
    Object.entries(data).forEach(([key, value]) => {
      store[key] = value;
    });
  }

  store.synced = true;
}

export async function insertTextVariable(
  context: Word.RequestContext,
  variable: Variable,
) {
  const selection = context.document.getSelection();

  selection.insertText(variable.name, "Replace");
  selection.load("text");

  await context.sync();

  const ccId = await insertTextVarContentControl(
    context,
    selection,
    variable.id,
  );

  store[ccId] = variable;
}

export async function insertConditionVariable(
  context: Word.RequestContext,
  condition: TCondition,
  readableCondition: string,
) {
  const selection = context.document.getSelection();
  context.load(selection, "text");
  await context.sync();

  const ccId = await insertConditionContentControl(
    context,
    selection,
    condition.id,
    readableCondition,
  );

  store[ccId] = condition;
}

export const useAddInStore = () => {
  return useSnapshot(store);
};
