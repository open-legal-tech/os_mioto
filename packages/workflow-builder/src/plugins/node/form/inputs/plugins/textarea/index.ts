import { TextVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { TextAreaInput } from "./TextAreaInputPlugin";
import { ZTextAreaInput } from "./type";
import { TextInputEditor } from "./ui/TextAreaInputEditor";
import { TextAreaInputRenderer } from "./ui/TextAreaInputRenderer";

export const TextAreaInputPluginObject = createInputPluginObject({
  plugin: TextAreaInput,
  type: TextAreaInput.type,
  BuilderComponent: {
    InputConfigurator: TextInputEditor,
  },
  RendererComponent: TextAreaInputRenderer,
  Type: ZTextAreaInput,
  Icon: TextVariableIcon,
});
