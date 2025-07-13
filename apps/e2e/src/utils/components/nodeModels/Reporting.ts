import type { Locator } from "@playwright/test";
import { EnvironmentModel } from "../../environments/Environment";
import { Attachements } from "../Attachements";
import { CanvasNodeComponent } from "../CanvasNode";
import { LogicUIModel } from "../LogicUIModel";
import { NodeSidebarModel } from "../NodeSidebarModel";
import { RichInputModel } from "../RichInputModel";
import { RichTextEditorModel } from "../RichTextEditorModel";
import type { Nodes } from "./Nodes";
import { createNewNodeFromPort } from "./utils/createNewNodeFromPort";

export class ReportingNodeModel {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }

  get sidebar() {
    return new ReportingNodeSidebarModel(this.environment, this.nodeName);
  }

  get canvasNode() {
    return new ReportingNodeCanvasNodeModel(
      this.environment,
      this.nodeName,
      "reporting",
    );
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class ReportingNodeSidebarModel extends NodeSidebarModel<typeof tabs> {
  get RichTextEditor() {
    return new RichTextEditorModel(this.environment);
  }
  readonly locators: {
    emailInput: Locator;
    subjectInput: RichInputModel;
    bodyRTE: RichTextEditorModel;
    attachPathCheckbox: Locator;
    attachementsInput: Attachements;
  };

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "reporting", nodeName, tabs);

    this.locators = {
      emailInput: this.environment.page
        .locator("Combobox")
        .filter({ hasText: "E-Mail des Administratorkontos" }),
      subjectInput: new RichInputModel({ environment, label: "Betreff" }),
      bodyRTE: new RichTextEditorModel(environment),
      attachPathCheckbox: this.environment.page
        .locator("label")
        .filter({ hasText: "Entscheidungsverlauf anhängen" }),
      attachementsInput: new Attachements(environment),
    };
  }
}

export class ReportingNodeCanvasNodeModel extends CanvasNodeComponent<"reporting"> {
  override async selectNode(params?: {
    content: string;
    type: "reporting";
  }): Promise<ReportingNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new ReportingNodeModel(
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
