import { EnvironmentModel } from "../../environments/Environment";
import { CanvasNodeComponent } from "../CanvasNode";
import { LogicUIModel } from "../LogicUIModel";
import { NodeSidebarModel } from "../NodeSidebarModel";
import { RichTextEditorModel } from "../RichTextEditorModel";
import type { Nodes } from "./Nodes";
import { createNewNodeFromPort } from "./utils/createNewNodeFromPort";

export class InfoNodeModel {
  nodeName: string;
  get renderer() {
    return new InfoNodeRendererModel(this.environment);
  }

  get sidebar() {
    return new InfoNodeSidebarModel(this.environment, this.nodeName);
  }

  get canvasNode() {
    return new InfoNodeCanvasNodeModel(this.environment, this.nodeName, "info");
  }
  readonly environment: EnvironmentModel;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }
}

export class InfoNodeRendererModel {
  readonly environment: EnvironmentModel;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class InfoNodeSidebarModel extends NodeSidebarModel<typeof tabs> {
  get RichTextEditor() {
    return new RichTextEditorModel(this.environment);
  }

  get LogicUI() {
    return new LogicUIModel(this.environment);
  }

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "info", nodeName, tabs);
  }
}

export class InfoNodeCanvasNodeModel extends CanvasNodeComponent<"info"> {
  override async selectNode(params?: {
    content: string;
    type: "info";
  }): Promise<InfoNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new InfoNodeModel(
      this.environment,
      params?.content ?? this.nodeName,
    );
  }

  override async createNewNodeFromPort<TType extends keyof Nodes>({
    coordinates = [100, 100],
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
