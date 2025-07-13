import { keys, mapValues } from "remeda";
import { z } from "zod";
import type { IInput, InputPlugin, InputPluginObject } from "./InputPlugin";

interface IInputPlugin<TType extends IInput = IInput> {
  plugin: InputPlugin<TType>;
  type: TType["type"];
  Type: z.ZodType<TType>;
}

export const createInputPluginObject = <TType extends IInput = IInput>(
  pluginObj: InputPluginObject<TType>,
) => {
  return pluginObj satisfies InputPluginObject<TType>;
};

export const createInputPluginGroup = <
  TInputPlugins extends Record<string, IInputPlugin>,
>(
  inputPlugins: TInputPlugins,
) => {
  const plugins = mapValues(inputPlugins, (plugin: any) => plugin.plugin);

  const types = keys(inputPlugins);
  const TypeArray = Object.values(inputPlugins).map((plugin) => plugin.Type);

  if (TypeArray.length === 1) {
    const Type = TypeArray[0];
    if (!Type) {
      throw new Error("Type not found.");
    }

    return {
      types,
      plugins,
      Type,
    };
  }

  const Type = z.union(TypeArray as any);

  return {
    types,
    plugins,
    Type,
  };
};

export const createInputPluginObjectGroup = <
  TInputPlugins extends Record<string, InputPluginObject>,
>(
  inputPlugins: TInputPlugins,
) => {
  const base = createInputPluginGroup(inputPlugins);

  const Builder = mapValues(
    inputPlugins,
    (plugin: any) => plugin.BuilderComponent,
  );
  const Renderer = mapValues(
    inputPlugins,
    (plugin: any) => plugin.RendererComponent,
  );
  const Icon = mapValues(inputPlugins, (plugin: any) => plugin.Icon);

  return {
    ...base,
    pluginObjects: inputPlugins,
    Builder,
    Renderer,
    Icon,
  };
};
