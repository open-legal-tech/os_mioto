import type { EnvironmentModel } from "../environments/Environment";
import type { Nodes } from "./nodeModels/Nodes";

export abstract class CanvasNodeComponent<TType extends keyof Nodes> {
  readonly environment: EnvironmentModel;
  readonly nodeName: string;
  readonly type: keyof Nodes;

  constructor(
    environment: EnvironmentModel,
    nodeName: string,
    type: keyof Nodes,
  ) {
    this.environment = environment;

    this.nodeName = nodeName;
    this.type = type;
  }

  /**
   * Returns a locator for a node with the given content. If the node is not selected
   * the selected = false option needs to be used.
   */
  private getNodeLocator(content: string) {
    return this.environment.page.getByRole("button", {
      name: content,
    });
  }

  /**
   * Returns a locator for a node with the given content. If the node is not selected
   * the selected = false option needs to be used.
   */
  getSelectedNodeLocator(content: string) {
    return this.getNodeLocator(content);
  }

  getUnselectedNodeLocator(content: string) {
    return this.getNodeLocator(content);
  }

  getEdgeLocator(uuid: string) {
    return this.environment.page.locator(`data-test=${uuid}_edge`);
  }

  abstract selectNode(params?: {
    content: string;
    type: TType;
  }): Promise<ReturnType<Nodes[TType]>>;

  get locators() {
    return {
      port: this.getNodeLocator(this.nodeName).getByRole("button", {
        name: "Port",
      }),
    };
  }

  abstract createNewNodeFromPort(params: {
    currentNodeName: string;
    newNodeName: string;
    coordinates?: [number, number];
    type: TType;
    select?: boolean;
  }): Promise<ReturnType<Nodes[TType]>>;
}
