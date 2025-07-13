import { AINodeSidebar } from "../plugins/node/ai/exports/editor";
import { AuthenticationNodeSidebar } from "../plugins/node/authentication/exports/editor";
import { CalculationNodeSidebar } from "../plugins/node/calculation/editor";
import { DocumentNodeSidebar } from "../plugins/node/documentv2/editor";
import { FormNodeSidebar } from "../plugins/node/form/exports/editor";
import { InfoNodeSidebar } from "../plugins/node/info/exports/editor";
import { LogicNodeSidebar } from "../plugins/node/logic/editor";
import { ReportingNodeSidebar } from "../plugins/node/reporting/editor";
import { TextInterpolationNodeSidebar } from "../plugins/node/text-interpolation/editor";
import type { TTreeClientWithPlugins } from "../tree/createTreeClientWithPlugins";
import type { NodePlugin } from "../tree/type/plugin/NodePlugin";
import type { TNodeSidebar } from "./editorTreeClient";

type PluginsWithSidebar<T extends Record<string, NodePlugin>> = {
  [K in keyof T]: T[K]["hasSidebar"] extends true ? K : never;
}[keyof T];

export type TPluginsWithSidebars = PluginsWithSidebar<
  TTreeClientWithPlugins["nodePlugins"]
>;

export const editorSidebars = {
  form: FormNodeSidebar,
  info: InfoNodeSidebar,
  documentv2: DocumentNodeSidebar,
  reporting: ReportingNodeSidebar,
  logic: LogicNodeSidebar,
  calculation: CalculationNodeSidebar,
  "text-interpolation": TextInterpolationNodeSidebar,
  authentication: AuthenticationNodeSidebar,
  ai: AINodeSidebar,
} satisfies Record<TPluginsWithSidebars, TNodeSidebar> as Record<
  TPluginsWithSidebars,
  TNodeSidebar
> & { [x: string]: TNodeSidebar };
