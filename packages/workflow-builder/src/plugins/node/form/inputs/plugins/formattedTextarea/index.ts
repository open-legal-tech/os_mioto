import { RichTextVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { FormattedTextAreaInput } from "./FormattedTextAreaInputPlugin";
import { ZFormattedTextAreaInput } from "./type";
import { FormattedTextInputEditor } from "./ui/FormattedTextAreaInputEditor";
import { FormattedTextAreaInputRenderer } from "./ui/FormattedTextAreaInputRenderer";

export const FormattedTextAreaInputPluginObject = createInputPluginObject({
  plugin: FormattedTextAreaInput,
  type: FormattedTextAreaInput.type,
  BuilderComponent: {
    InputConfigurator: FormattedTextInputEditor,
  },
  RendererComponent: FormattedTextAreaInputRenderer,
  Type: ZFormattedTextAreaInput,
  Icon: RichTextVariableIcon,
});
