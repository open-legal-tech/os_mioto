import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { CreateNodeDropdown } from "./CreateNodeDropdown";
import { DeleteNodesDialogComponent } from "./DeleteNodesDialogComponent";
import { RendererComponent } from "./RendererComponent";
import { SyncPausedInfoComponent } from "./SyncPausedDialog";
import { type Nodes, nodes } from "./nodeModels/Nodes";

export class EditorComponent {
  readonly environment: EnvironmentModel;
  readonly createNodeButton: Locator;
  readonly canvas: Locator;
  readonly zoomOutButton: Locator;
  readonly zoomInButton: Locator;
  readonly fitViewButton: Locator;
  readonly deleteNodesDialog: DeleteNodesDialogComponent;
  readonly syncPausedDialog: SyncPausedInfoComponent;
  readonly nodes: Nodes;

  get previewButton() {
    return this.environment.page.getByRole("button", {
      name: "Anwendungsvorschau",
    });
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.createNodeButton = this.environment.page.locator(
      `role=button[name="${de.app.editor.createNodeButton.tooltip}"]`,
    );

    this.canvas = environment.page.locator(`[data-test=canvas]`);

    this.zoomOutButton = environment.page.locator(
      `role=button[name="${de.app.editor.toolbar.zoomOut.hiddenLabel}"]`,
    );
    this.zoomInButton = environment.page.locator(
      `role=button[name="${de.app.editor.toolbar.zoomIn.hiddenLabel}"]`,
    );
    this.fitViewButton = environment.page.locator(
      `role=button[name="${de.app.editor.toolbar.fitView.hiddenLabel}"]`,
    );
    this.deleteNodesDialog = new DeleteNodesDialogComponent(environment);
    this.syncPausedDialog = new SyncPausedInfoComponent(environment);
    this.nodes = nodes(environment);
  }

  getEdgeLocator(uuid: string) {
    return this.environment.page.locator(`data-test=${uuid}_edge`);
  }

  getSidebarLocator() {
    return this.environment.page.locator(`aside >> label >> text='Blockname'`);
  }

  async openPreview() {
    await this.previewButton.click();
    return new RendererComponent(this.environment);
  }

  async pan(x: number, y: number) {
    const canvasBoundingBox = await this.canvas.boundingBox();

    if (!canvasBoundingBox) throw new Error("Canvas not found");

    await this.environment.page.mouse.move(
      canvasBoundingBox.x + 200,
      canvasBoundingBox.y + 400,
    );
    await this.environment.page.mouse.down();
    await this.environment.page.mouse.move(x, y);
    await this.environment.page.mouse.up();
  }

  async zoom(amount: number) {
    const canvasBoundingBox = await this.canvas.boundingBox();

    if (!canvasBoundingBox) throw new Error("Canvas not found");

    await this.environment.page.mouse.move(
      canvasBoundingBox.x,
      canvasBoundingBox.y,
    );
    await this.environment.page.keyboard.down("Control");
    await this.environment.page.mouse.wheel(0, amount);
    await this.environment.page.keyboard.up("Control");
  }

  async openCreateNodeDropdown() {
    await this.createNodeButton.click();

    return new CreateNodeDropdown(this.environment);
  }

  async createNode<TType extends keyof typeof this.nodes>({
    nodeName,
    type,
    select,
  }: {
    nodeName: string;
    type: TType;
    select?: boolean;
  }) {
    const createNodeDropdown = await this.openCreateNodeDropdown();
    const nodePlugin = await createNodeDropdown.selectOption(type);

    select &&
      (await nodes(this.environment)[type](nodeName).canvasNode.selectNode());

    return nodePlugin(nodeName) as ReturnType<(typeof this.nodes)[typeof type]>;
  }
}
