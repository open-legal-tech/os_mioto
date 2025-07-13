import { SelectVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { SelectInput } from "./SelectInputPlugin";
import { ZSelectInput } from "./type";
import {
  SelectInputConfigurator,
  SelectInputPrimaryActionSlot,
} from "./ui/SelectInputEditor";
import { SelectInputRendererComponent } from "./ui/SelectInputRenderer";

export const SelectInputPluginObject = createInputPluginObject({
  plugin: SelectInput,
  type: SelectInput.type,
  BuilderComponent: {
    PrimaryActionSlot: SelectInputPrimaryActionSlot,
    InputConfigurator: SelectInputConfigurator,
  },
  RendererComponent: SelectInputRendererComponent,
  Type: ZSelectInput,
  Icon: SelectVariableIcon,
});
