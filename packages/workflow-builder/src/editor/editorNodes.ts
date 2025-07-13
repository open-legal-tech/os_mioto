import { AICanvasNode } from "../plugins/node/ai/exports/editor";
import { AuthenticationCanvasNode } from "../plugins/node/authentication/exports/editor";
import { CalculationCanvasNode } from "../plugins/node/calculation/editor";
import { DocumentCanvasNode } from "../plugins/node/documentv2/editor";
import { FormCanvasNode } from "../plugins/node/form/exports/editor";
import { InfoCanvasNode } from "../plugins/node/info/exports/editor";
import { LogicCanvasNode } from "../plugins/node/logic/editor";
import { ReportingCanvasNode } from "../plugins/node/reporting/editor";
import { TextInterpolationCanvasNode } from "../plugins/node/text-interpolation/editor";
import type { TTreeClientWithPlugins } from "../tree/createTreeClientWithPlugins";
import type { NodePlugin } from "../tree/type/plugin/NodePlugin";
import type { TCanvasNode } from "./editorTreeClient";

type PluginsWithCanvasNode<T extends Record<string, NodePlugin>> = {
  [K in keyof T]: T[K]["hasCanvasNode"] extends true ? K : never;
}[keyof T];

export type TPluginsWithCanvasNode = PluginsWithCanvasNode<
  TTreeClientWithPlugins["nodePlugins"]
>;

export const editorNodes = {
  form: FormCanvasNode,
  info: InfoCanvasNode,
  documentv2: DocumentCanvasNode,
  reporting: ReportingCanvasNode,
  logic: LogicCanvasNode,
  calculation: CalculationCanvasNode,
  "text-interpolation": TextInterpolationCanvasNode,
  authentication: AuthenticationCanvasNode,
  ai: AICanvasNode,
} satisfies Record<TPluginsWithCanvasNode, TCanvasNode> as Record<
  TPluginsWithCanvasNode,
  TCanvasNode
> & { [x: string]: TCanvasNode };
