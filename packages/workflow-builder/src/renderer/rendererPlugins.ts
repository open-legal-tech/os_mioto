import { FormNode } from "../plugins/node/form/exports/plugin";
import { FormNodeRenderer } from "../plugins/node/form/exports/renderer";
import { InfoNode } from "../plugins/node/info/exports/plugin";
import { InfoNodeRenderer } from "../plugins/node/info/exports/renderer";
import type { TTreeClientWithPlugins } from "../tree/createTreeClientWithPlugins";
import type { NodePlugin } from "../tree/type/plugin/NodePlugin";
import type { TNodeRenderer } from "./types";

type PluginsWithRenderer<T extends Record<string, NodePlugin>> = {
  [K in keyof T]: T[K]["hasRenderer"] extends true ? K : never;
}[keyof T];

export type TPluginsWithRenderers = PluginsWithRenderer<
  TTreeClientWithPlugins["nodePlugins"]
>;

export const renderers = {
  [FormNode.type]: FormNodeRenderer,
  [InfoNode.type]: InfoNodeRenderer,
} satisfies Record<TPluginsWithRenderers, TNodeRenderer> as Record<
  TPluginsWithRenderers,
  TNodeRenderer
> & { [x: string]: TNodeRenderer };
