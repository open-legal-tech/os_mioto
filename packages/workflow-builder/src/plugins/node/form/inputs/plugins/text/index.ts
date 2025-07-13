import { TextVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { TextInput } from "./TextInputPlugin";
import { ZTextInput } from "./type";
import { TextInputEditor } from "./ui/TextInputEditor";
import { TextInputRenderer } from "./ui/TextInputRenderer";

export const TextInputPluginObject = createInputPluginObject({
  plugin: TextInput,
  type: TextInput.type,
  BuilderComponent: {
    InputConfigurator: TextInputEditor,
  },
  RendererComponent: TextInputRenderer,
  Type: ZTextInput,
  Icon: TextVariableIcon,
});
