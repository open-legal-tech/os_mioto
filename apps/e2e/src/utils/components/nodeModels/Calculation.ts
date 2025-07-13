import { EnvironmentModel } from "../../environments/Environment";
import { CanvasNodeComponent } from "../CanvasNode";
import { LogicUIModel } from "../LogicUIModel";
import { NodeSidebarModel } from "../NodeSidebarModel";
import { RichNumberEditorModel } from "../RichNumberEditorModel";
import type { Nodes } from "./Nodes";
import { createNewNodeFromPort } from "./utils/createNewNodeFromPort";

export class CalculationNodeModel {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }

  get sidebar() {
    return new CalculationNodeSidebarModel(this.environment, this.nodeName);
  }

  get canvasNode() {
    return new CalculationNodeCanvasNodeModel(
      this.environment,
      this.nodeName,
      "calculation",
    );
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class CalculationNodeSidebarModel extends NodeSidebarModel<typeof tabs> {
  get RichNumberEditor() {
    return new RichNumberEditorModel(this.environment);
  }

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "calculation", nodeName, tabs);
  }
}

export class CalculationNodeCanvasNodeModel extends CanvasNodeComponent<"calculation"> {
  override async selectNode(params?: {
    content: string;
    type: "calculation";
  }): Promise<CalculationNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new CalculationNodeModel(
      this.environment,
      params?.content ?? this.nodeName,
    );
  }

  override async createNewNodeFromPort<TType extends keyof Nodes>({
    coordinates = [250, 250],
    newNodeName,
    type,
    select,
  }: {
    currentNodeName: string;
    newNodeName: string;
    coordinates?: [number, number];
    type: TType;
    select?: boolean;
  }): Promise<ReturnType<Nodes[typeof type]>> {
    return createNewNodeFromPort({
      plugin: this,
      coordinates,
      newNodeName,
      newNodeType: type,
      select,
    });
  }
}
