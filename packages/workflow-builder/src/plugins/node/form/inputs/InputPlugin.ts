import type { TranslationFn } from "@mioto/locale";
import type { z } from "zod";
import type { ZInputPlugin } from "./plugins/ZInputPlugin";
import type {
  InputConfigurator,
  InputPrimaryActionSlot,
  InputRenderer,
} from "./types/componentTypes";
import type { updateLabel } from "./utils/inputMethods/updateLabel";
import type { updateNoRendererLabel } from "./utils/inputMethods/updateNoRendererLabel";

export type InputPluginObject<TType extends IInput = any> = {
  plugin: InputPlugin<TType>;
  type: TType["type"];
  BuilderComponent: {
    PrimaryActionSlot?: InputPrimaryActionSlot;
    InputConfigurator?: InputConfigurator;
  };
  RendererComponent?: InputRenderer;
  Type: z.ZodType<TType>;
  Icon:
    | React.ForwardRefExoticComponent<any & React.RefAttributes<SVGSVGElement>>
    | (() => React.ReactNode);
};

export type TInputId = `input_${string}`;

export type IInput<TType extends string = string> = z.infer<
  ReturnType<typeof ZInputPlugin<TType>>
>;

export type createFn<TType extends IInput> = (
  data: Partial<TType> & { t: TranslationFn },
) => TType;

export abstract class InputPlugin<TType extends IInput = IInput> {
  pluginType = "pluginEntity" as const;
  type: TType["type"];

  constructor(type: TType["type"]) {
    this.type = type;
  }

  abstract create: createFn<TType>;
  abstract updateLabel: typeof updateLabel;
  abstract updateNoRendererLabel: typeof updateNoRendererLabel;
}
