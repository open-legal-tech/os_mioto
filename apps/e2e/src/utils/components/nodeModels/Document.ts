import type { Locator } from "@playwright/test";
import { EnvironmentModel } from "../../environments/Environment";
import { CanvasNodeComponent } from "../CanvasNode";
import { LogicUIModel } from "../LogicUIModel";
import { NodeSidebarModel } from "../NodeSidebarModel";
import type { Nodes } from "./Nodes";
import { createNewNodeFromPort } from "./utils/createNewNodeFromPort";

export class DocumentNodeModel {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;
    this.nodeName = nodeName;
  }

  get sidebar() {
    return new DocumentNodeSidebarModel(this.environment, this.nodeName);
  }

  get canvasNode() {
    return new DocumentNodeCanvasNodeModel(
      this.environment,
      this.nodeName,
      "document",
    );
  }
}

const tabs = {
  Inhalt: EnvironmentModel,
  Verbindungen: LogicUIModel,
};

export class DocumentNodeSidebarModel extends NodeSidebarModel<typeof tabs> {
  readonly locators: {
    documentNameInput: Locator;
    uploadTemplateButton: Locator;
    updateTemplateButton: Locator;
    templateDownloadButton: Locator;
    templateDeleteButton: Locator;
  };

  constructor(environment: EnvironmentModel, nodeName: string) {
    super(environment, "document", nodeName, tabs);

    this.locators = {
      documentNameInput: this.environment.page.getByRole("textbox", {
        name: "Dokumentenname",
      }),
      uploadTemplateButton:
        this.environment.page.getByText("Template hochladen"),
      updateTemplateButton: this.environment.page.getByText(
        "Template aktualisieren",
      ),
      templateDownloadButton: this.environment.page.getByRole("link", {
        name: "Template herunterladen",
      }),
      templateDeleteButton: this.environment.page.getByRole("button", {
        name: "Template löschen",
      }),
    };
  }

  async uploadTemplate(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.environment.page.waitForEvent("filechooser"),
      this.locators.uploadTemplateButton.click(),
    ]);

    await Promise.all([
      this.environment.page.waitForResponse("**/template/create**"),
      fileChooser.setFiles(filePath),
    ]);
  }

  async updateTemplate(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.environment.page.waitForEvent("filechooser"),
      this.locators.updateTemplateButton.click(),
    ]);

    await Promise.all([
      this.environment.page.waitForResponse("**/template/**/update**"),
      fileChooser.setFiles(filePath),
    ]);
  }

  async updateDocumentName(name: string) {
    await this.locators.documentNameInput.fill(name);
  }

  async downloadTemplate() {
    const downloadPromise = this.environment.page.waitForEvent("download");

    await this.locators.templateDownloadButton.click();

    const download = await downloadPromise;

    await download.saveAs(
      `${this.environment.testInfo.outputDir}/${this.environment.testInfo.title}__${this.environment.testInfo.project.name}.docx`,
    );

    return download;
  }

  async removeTemplate() {
    await this.locators.templateDeleteButton.click();
  }
}

export class DocumentNodeCanvasNodeModel extends CanvasNodeComponent<"document"> {
  override async selectNode(params?: {
    content: string;
    type: "document";
  }): Promise<DocumentNodeModel> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.getUnselectedNodeLocator(params?.content ?? this.nodeName).click(),
    ]);

    return new DocumentNodeModel(
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
