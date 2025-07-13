import type { TranslationFn, TranslationKeys } from "@mioto/locale";
import type { JSONContent } from "@tiptap/core";
import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "rich-text";

export interface IRichTextVariable<
  Id extends TChildId | TMainChildId = TChildId | TMainChildId,
> extends IBaseVariable<typeof typeName, Id> {
  value?: JSONContent;
  readableValue?: string;
}

class CRichTextVariable extends BaseVariable<IRichTextVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TChildId | TMainChildId = TChildId | TMainChildId>({
    value,
    readableValue,
    name,
    ...data
  }: Omit<IRichTextVariable<Id>, "type" | "escapedName" | "status" | "name"> & {
    name:
      | {
          key: TranslationKeys;
          escapedName: string;
          t: TranslationFn;
        }
      | string;
  }): IRichTextVariable<Id> => {
    const translatedName =
      typeof name !== "string" ? name.t?.(name.key) ?? name.key : name;

    return {
      type: this.type,
      escapedName: this.createReadableKey([
        typeof name === "string" ? name : name.escapedName,
      ]),
      value,
      readableValue,
      status: "ok",
      name: translatedName,
      ...data,
    };
  };
}

export { TextColumns as RichTextVariableIcon } from "@phosphor-icons/react/dist/ssr/TextColumns";

export const RichTextVariable = new CRichTextVariable();
