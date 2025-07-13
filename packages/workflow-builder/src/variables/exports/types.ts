import { type TChildId, type TMainChildId, isNodeId } from "../../tree/id";
import type {
  BooleanVariable,
  IBooleanVariable,
} from "../dataTypes/BooleanVariable";
import type { IDateVariable } from "../dataTypes/DateVariable";
import type {
  DefinedFileVariable,
  FileVariable,
  IFileVariable,
} from "../dataTypes/FileVariable";
import type { ModuleVariable } from "../dataTypes/ModuleVariable";
import type {
  IMultiSelectVariable,
  MultiSelectVariable,
} from "../dataTypes/MultiSelectVariable";
import type {
  INumberVariable,
  NumberVariable,
} from "../dataTypes/NumberVariable";
import type {
  IRecordVariable,
  RecordVariable,
} from "../dataTypes/RecordVariable";
import type {
  IRichTextVariable,
  RichTextVariable,
} from "../dataTypes/RichTextVariable";
import type {
  ISelectVariable,
  SelectVariable,
} from "../dataTypes/SelectVariable";
import type { ITextVariable } from "../dataTypes/TextVariable";
import type { IEmailVariable } from "../dataTypes/EmailVariable";

export * from "../dataTypes/BooleanVariable";
export * from "../dataTypes/DateVariable";
export * from "../dataTypes/FileVariable";
export * from "../dataTypes/ModuleVariable";
export * from "../dataTypes/MultiSelectVariable";
export * from "../dataTypes/NumberVariable";
export * from "../dataTypes/RecordVariable";
export * from "../dataTypes/RichTextVariable";
export * from "../dataTypes/SelectVariable";
export * from "../dataTypes/TextVariable";
export * from "../dataTypes/EmailVariable";

export type { VariableExecutionStatus } from "../Variable";

export type VariableClass =
  | typeof FileVariable
  | typeof RecordVariable
  | typeof ModuleVariable
  | typeof RichTextVariable
  | typeof SelectVariable
  | typeof MultiSelectVariable
  | typeof NumberVariable
  | typeof BooleanVariable;

export type Variable =
  | PrimitiveVariable
  | GroupVariable
  | IFileVariable
  | IRichTextVariable;

export const isVariable = (variable: any): variable is Variable =>
  variable?.type &&
  (isPrimitiveVariable(variable) ||
    isGroupVariable(variable) ||
    isFileVariable(variable) ||
    isRichTextVariable(variable));

export type GroupVariable = IRecordVariable<
  PrimitiveVariable | IFileVariable | IRichTextVariable
>;

export const isGroupVariable = (
  variable: Variable,
): variable is GroupVariable => variable.type === "record";

export const isPrimitiveVariable = (
  variable: Variable,
): variable is PrimitiveVariable =>
  variable.type === "text" ||
  variable.type === "email" ||
  variable.type === "select" ||
  variable.type === "multi-select" ||
  variable.type === "number" ||
  variable.type === "boolean" ||
  variable.type === "date";

export const isRootVariable = (variable: Variable): variable is Variable =>
  isNodeId(variable.id);

export const isFileVariable = (
  variable?: Variable,
): variable is IFileVariable => variable != null && variable.type === "file";

export const isRichTextVariable = (
  variable?: Variable,
): variable is IRichTextVariable =>
  variable != null && variable.type === "rich-text";

export const isDefinedFileVariable = (
  variable?: Variable,
): variable is DefinedFileVariable =>
  variable != null && isFileVariable(variable) && variable.value !== undefined;

export type TypeGuards =
  | typeof isGroupVariable
  | typeof isPrimitiveVariable
  | typeof isFileVariable
  | typeof isDefinedFileVariable;

export type PrimitiveVariable<
  TId extends TMainChildId | TChildId = TMainChildId | TChildId,
> =
  | ITextVariable<TId>
  | IEmailVariable<TId>
  | ISelectVariable<TId>
  | IMultiSelectVariable<TId>
  | INumberVariable<TId>
  | IBooleanVariable<TId>
  | IDateVariable<TId>
