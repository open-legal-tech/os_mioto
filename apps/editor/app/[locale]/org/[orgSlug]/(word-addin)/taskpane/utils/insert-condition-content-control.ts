import type { TCondition } from "@mioto/workflow-builder/edge-plugin/complex-logic/type";

export async function insertConditionContentControl(
  context: Word.RequestContext,
  selection: Word.Range,
  conditionId: TCondition["id"],
  readableCondition: string,
): Promise<Word.ContentControl["id"]> {
  const cc = selection.insertContentControl();

  cc.appearance = "Tags";
  cc.tag = conditionId;
  cc.title = readableCondition;
  cc.color = "#6ad8e6";

  await context.sync();

  return cc.id;
}
