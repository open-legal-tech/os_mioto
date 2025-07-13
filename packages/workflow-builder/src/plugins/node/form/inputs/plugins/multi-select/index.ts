import { MultiSelectVariableIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { MultiSelectInput } from "./MultiSelectInputPlugin";
import { ZMultiSelectInput } from "./type";
import {
  MultiSelectInputConfigurator,
  MultiSelectInputPrimaryActionSlot,
} from "./ui/MultiSelectEditor";
import { MultiSelectInputRenderer } from "./ui/MultiSelectRenderer";

export const MultiSelectInputPluginObject = createInputPluginObject({
  plugin: MultiSelectInput,
  type: MultiSelectInput.type,
  BuilderComponent: {
    InputConfigurator: MultiSelectInputConfigurator,
    PrimaryActionSlot: MultiSelectInputPrimaryActionSlot,
  },
  RendererComponent: MultiSelectInputRenderer,
  Icon: MultiSelectVariableIcon,
  Type: ZMultiSelectInput,
});
