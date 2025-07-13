import {
  DateInput,
  type IDateInput,
} from "../inputs/plugins/date/DateInputPlugin";
import { FileInput } from "../inputs/plugins/file/FileInputPlugin";
import type { IFileInput } from "../inputs/plugins/file/type";
import { FormattedTextAreaInput } from "../inputs/plugins/formattedTextarea/FormattedTextAreaInputPlugin";
import type { IFormattedTextAreaInput } from "../inputs/plugins/formattedTextarea/FormattedTextAreaInputPlugin";
import {
  type IMultiSelectInput,
  MultiSelectInput,
} from "../inputs/plugins/multi-select/MultiSelectInputPlugin";
import {
  type INumberInput,
  NumberInput,
} from "../inputs/plugins/number/NumberInputPlugin";
import {
  type ISelectInput,
  SelectInput,
} from "../inputs/plugins/select/SelectInputPlugin";
import {
  type ITextInput,
  TextInput,
} from "../inputs/plugins/text/TextInputPlugin";
import {
  type ITextAreaInput,
  TextAreaInput,
} from "../inputs/plugins/textarea/TextAreaInputPlugin";
import {
  type IEmailInput,
  EmailInput,
} from "../inputs/plugins/email/EmailInputPlugin";

export const formNodeInputPlugins = {
  [MultiSelectInput.type]: MultiSelectInput,
  [TextInput.type]: TextInput,
  [SelectInput.type]: SelectInput,
  [TextAreaInput.type]: TextAreaInput,
  [NumberInput.type]: NumberInput,
  [FileInput.type]: FileInput,
  [DateInput.type]: DateInput,
  [FormattedTextAreaInput.type]: FormattedTextAreaInput,
  [EmailInput.type]: EmailInput,
};

export type TFormNodeInput =
  | IMultiSelectInput
  | ITextInput
  | ISelectInput
  | ITextAreaInput
  | INumberInput
  | IFileInput
  | IDateInput
  | IFormattedTextAreaInput
  | IEmailInput;

export type TFormInputTypes = NonNullable<
  {
    [K in keyof TFormNodeInput]: TFormNodeInput["type"];
  }[keyof TFormNodeInput]
>;
