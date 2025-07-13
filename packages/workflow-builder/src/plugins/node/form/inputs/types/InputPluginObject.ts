import type { IInput, InputPlugin } from "../InputPlugin";
import type {
  InputConfiguratorProps,
  InputPrimaryActionSlotProps,
  InputRendererProps,
} from "./componentTypes";

export type InputPluginObject<TInputPlugin extends IInput = IInput> = {
  plugin: InputPlugin<TInputPlugin>;
  type: TInputPlugin["type"];
  BuilderComponent: {
    InputConfigurator:
      | ((props: InputConfiguratorProps) => React.ReactNode)
      | null;
    PrimaryActionSlot:
      | ((props: InputPrimaryActionSlotProps) => React.ReactNode)
      | null;
  };
  RendererComponent: (props: InputRendererProps) => React.ReactNode;
};
