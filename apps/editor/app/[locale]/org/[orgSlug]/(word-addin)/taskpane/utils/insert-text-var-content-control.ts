import { TAG_TITLE_TEXT_VAR } from "../constants";

export async function insertTextVarContentControl(
  context: Word.RequestContext,
  selection: Word.Range,
  tagCc: string,
): Promise<number> {
  const cc = selection.insertContentControl();
  cc.appearance = "Tags";
  cc.tag = tagCc;
  cc.title = TAG_TITLE_TEXT_VAR;
  cc.color = "#d756ee";
  cc.cannotEdit = true;

  await context.sync();

  return cc.id;
}
