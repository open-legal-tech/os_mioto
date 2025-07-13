import { EnvironmentModel } from "../../environments/Environment";
import { CanvasNodeComponent } from "../CanvasNode";
import { LogicUIModel } from "../LogicUIModel";
import { NodeSidebarModel } from "../NodeSidebarModel";
import { RichTextEditorModel } from "../RichTextEditorModel";
import type { Nodes } from "./Nodes";
import { createNewNodeFromPort } from "./utils/createNewNodeFromPort";

export class TextInterpolationNodeModel {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }

  get sidebar() {
    return new TextInterpolationNodeSidebarModel(
      this.environment,
      this.nodeName,
    );
  }

  get canvasNode() {
    return new TextInterpolationNodeCanvasNodeModel(
      this.environment,
      this.nodeName,
      "text-interpolation",
    );
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class TextInterpolationNodeSidebarModel extends NodeSidebarModel<
  typeof tabs
> {
  readonly locators: {
    richTextEditor: RichTextEditorModel;
  };

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "reporting", nodeName, tabs);

    this.locators = {
      richTextEditor: new RichTextEditorModel(environment),
    };
  }
}

export class TextInterpolationNodeCanvasNodeModel extends CanvasNodeComponent<"text-interpolation"> {
  override async selectNode(params?: {
    content: string;
    type: "text-interpolation";
  }): Promise<TextInterpolationNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new TextInterpolationNodeModel(
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
  }): Promise<ReturnType<Nodes[TType]>> {
    return createNewNodeFromPort({
      plugin: this,
      coordinates,
      newNodeName,
      newNodeType: type,
      select,
    });
  }
}
