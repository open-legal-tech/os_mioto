import type { EnvironmentModel } from "../../environments/Environment";
import { CalculationNodeModel } from "./Calculation";
import { DocumentNodeModel } from "./Document";
import { InfoNodeModel, InfoNodeRendererModel } from "./Info";
import { ReportingNodeModel } from "./Reporting";
import { TextInterpolationNodeModel } from "./TextInterpolation";
import { FormNodeModel, FormNodeRendererModel } from "./form/Form";

export type Nodes = {
  info: (nodeName: string) => InfoNodeModel;
  form: (nodeName: string) => FormNodeModel;
  document: (nodeName: string) => DocumentNodeModel;
  calculation: (nodeName: string) => CalculationNodeModel;
  reporting: (nodeName: string) => ReportingNodeModel;
  "text-interpolation": (nodeName: string) => TextInterpolationNodeModel;
};

export const nodes = (model: EnvironmentModel): Nodes => ({
  info: (nodeName) => new InfoNodeModel(model, nodeName),
  form: (nodeName) => new FormNodeModel(model, nodeName),
  document: (nodeName) => new DocumentNodeModel(model, nodeName),
  calculation: (nodeName: string) => new CalculationNodeModel(model, nodeName),
  reporting: (nodeName) => new ReportingNodeModel(model, nodeName),
  "text-interpolation": (nodeName) =>
    new TextInterpolationNodeModel(model, nodeName),
});

export type NodesRenderer = {
  info: InfoNodeRendererModel;
  form: FormNodeRendererModel;
};

export const nodesRenderer = (model: EnvironmentModel): NodesRenderer => ({
  info: new InfoNodeRendererModel(model),
  form: new FormNodeRendererModel(model),
});
