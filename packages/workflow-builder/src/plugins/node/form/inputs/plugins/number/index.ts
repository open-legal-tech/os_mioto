import { NumberVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { NumberInput } from "./NumberInputPlugin";
import { ZNumberInput } from "./type";
import { NumberInputEditor } from "./ui/NumberInputEditor";
import { NumberInputRenderer } from "./ui/NumberInputRenderer";

export const NumberInputPluginObject = createInputPluginObject({
  plugin: NumberInput,
  type: NumberInput.type,
  BuilderComponent: {
    InputConfigurator: NumberInputEditor,
  },
  RendererComponent: NumberInputRenderer,
  Type: ZNumberInput as any,
  Icon: NumberVariableIcon,
});
