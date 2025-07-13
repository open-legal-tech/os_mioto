import { DateIcon } from "../../../../../../variables/exports/types";
import { createInputPluginObject } from "../../createInputPluginGroup";
import { DateInput } from "./DateInputPlugin";
import { ZDateInput } from "./type";
import { DateInputEditor } from "./ui/DateInputEditor";
import { DateInputRenderer } from "./ui/DateInputRenderer";

export const DateInputPluginObject = createInputPluginObject({
  plugin: DateInput,
  type: DateInput.type,
  BuilderComponent: {
    InputConfigurator: DateInputEditor,
  },
  RendererComponent: DateInputRenderer,
  Type: ZDateInput,
  Icon: DateIcon,
});
