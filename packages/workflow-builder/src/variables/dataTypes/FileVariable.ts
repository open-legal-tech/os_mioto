import type { TChildId, TMainChildId } from "../../tree/id";
import { BaseVariable, type IBaseVariable } from "../Variable";

const typeName = "file";

export interface IFileVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> extends IBaseVariable<typeof typeName, Id> {
  /** The documentName is a name that can be specified as the canoncial name of this document. */
  fileType?: ("pdf" | "docx")[];
  value?: {
    uuid: string;
    /** The fileName is the original name the file had when it was uploaded. */
    fileName: string;
  };
  readableValue: string;
}

export type DefinedFileVariable<
  Id extends TMainChildId | TChildId = TMainChildId | TChildId,
> = Required<IFileVariable<Id>>;

class CFileVariable extends BaseVariable<IFileVariable> {
  constructor() {
    super(typeName);
  }

  create = <Id extends TMainChildId | TChildId = TMainChildId | TChildId>({
    value,
    execution = "unexecuted",
    name,
    ...data
  }: Omit<
    IFileVariable<Id>,
    "type" | "escapedName" | "execution" | "readableValue" | "name"
  > & {
    name: string;
  } & Partial<Pick<IFileVariable, "execution">>): IFileVariable<Id> => {
    return {
      type: this.type,
      value,
      escapedName: this.createReadableKey([name]),
      execution,
      readableValue: name,
      name,
      ...data,
    };
  };
}

export { File as FileVariableIcon } from "@phosphor-icons/react/dist/ssr/File";

export const FileVariable = new CFileVariable();
