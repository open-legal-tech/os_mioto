import { EmailVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { EmailInput } from "./EmailInputPlugin";
import { ZEmailInput } from "./type";
import { EmailInputEditor } from "./ui/EmailInputEditor";
import { EmailInputRenderer } from "./ui/EmailInputRenderer";

export const EmailInputPluginObject = createInputPluginObject({
  plugin: EmailInput,
  type: EmailInput.type,
  BuilderComponent: {
    InputConfigurator: EmailInputEditor,
  },
  RendererComponent: EmailInputRenderer,
  Type: ZEmailInput,
  Icon: EmailVariableIcon,
});
