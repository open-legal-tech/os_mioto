import { BooleanIcon } from "./dataTypes/BooleanVariable";
import { DateIcon } from "./dataTypes/DateVariable";
import { FileVariableIcon, type IFileVariable } from "./dataTypes/FileVariable";
import MultiSelectVariableIcon from "./dataTypes/MultiSelectVariableIcon";
import NumberVariableIcon from "./dataTypes/NumberVariableIcon";
import type { IRecordVariable } from "./dataTypes/RecordVariable";
import {
  type IRichTextVariable,
  RichTextVariableIcon,
} from "./dataTypes/RichTextVariable";
import SelectVariableIcon from "./dataTypes/SelectVariableIcon";
import { TextVariableIcon } from "./dataTypes/TextVariable";
import type { PrimitiveVariable } from "./exports/types";
import { EmailVariableIcon } from "./dataTypes/EmailVariable";

export const variableIcons: Record<
  | PrimitiveVariable["type"]
  | IFileVariable["type"]
  | IRichTextVariable["type"]
  | IRecordVariable["type"],
  React.ReactNode
> = {
  text: <TextVariableIcon />,
  email: <EmailVariableIcon />,
  select: <SelectVariableIcon />,
  "multi-select": <MultiSelectVariableIcon />,
  number: <NumberVariableIcon />,
  file: <FileVariableIcon />,
  "rich-text": <RichTextVariableIcon />,
  record: null,
  boolean: <BooleanIcon />,
  date: <DateIcon />,
};
