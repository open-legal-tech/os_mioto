import { DateInputPluginObject } from "../inputs/plugins/date";
import { FileInputPluginObject } from "../inputs/plugins/file";
import { FormattedTextAreaInputPluginObject } from "../inputs/plugins/formattedTextarea";
import { EmailInputPluginObject } from "../inputs/plugins/email";
import { MultiSelectInputPluginObject } from "../inputs/plugins/multi-select";
import { NumberInputPluginObject } from "../inputs/plugins/number";
import { SelectInputPluginObject } from "../inputs/plugins/select";
import { TextInputPluginObject } from "../inputs/plugins/text";
import { TextAreaInputPluginObject } from "../inputs/plugins/textarea";

export const formNodeInputPluginObjects = {
  [MultiSelectInputPluginObject.type]: MultiSelectInputPluginObject,
  [TextInputPluginObject.type]: TextInputPluginObject,
  [SelectInputPluginObject.type]: SelectInputPluginObject,
  [TextAreaInputPluginObject.type]: TextAreaInputPluginObject,
  [NumberInputPluginObject.type]: NumberInputPluginObject,
  [FileInputPluginObject.type]: FileInputPluginObject,
  [DateInputPluginObject.type]: DateInputPluginObject,
  [FormattedTextAreaInputPluginObject.type]: FormattedTextAreaInputPluginObject,
  [EmailInputPluginObject.type]: EmailInputPluginObject,
};
