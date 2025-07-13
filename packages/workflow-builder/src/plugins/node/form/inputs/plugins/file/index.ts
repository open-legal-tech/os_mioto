import { FileVariableIcon } from "../../../../../../variables/exports/types";
import type { InputPluginObject } from "../../InputPlugin";
import { FileInput } from "./FileInputPlugin";
import { type IFileInput, ZFileInput } from "./type";
import { FileInputConfigurator } from "./ui/FileInputEditor";
import { FileInputRenderer } from "./ui/FileInputRenderer";

export const FileInputPluginObject = {
  plugin: FileInput,
  type: FileInput.type,
  BuilderComponent: {
    InputConfigurator: FileInputConfigurator,
  },
  RendererComponent: FileInputRenderer,
  Icon: FileVariableIcon,
  Type: ZFileInput,
} satisfies InputPluginObject<IFileInput>;
