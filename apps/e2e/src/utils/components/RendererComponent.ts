import type { EnvironmentModel } from "../environments/Environment";
import { RichTextRendererModel } from "./RichTextRendererModel";
import { type NodesRenderer, nodesRenderer } from "./nodeModels/Nodes";

export class RendererComponent {
  readonly environment: EnvironmentModel;

  get locators() {
    return {
      submitButton: this.environment.page.locator("button[type=submit]"),
      goBackButton: this.environment.page.getByRole("button", {
        name: "Zurück",
        exact: true,
      }),
      goForwardButton: this.environment.page.locator("button >> text=Vor"),
    };
  }

  get RichTextRenderer() {
    return new RichTextRendererModel(this.environment);
  }

  get Nodes() {
    return nodesRenderer(this.environment);
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  async next<TType extends keyof NodesRenderer>(
    type: TType,
  ): Promise<NodesRenderer[TType]>;
  async next(): Promise<undefined>;
  async next<TType extends keyof NodesRenderer>(
    type?: TType,
  ): Promise<NodesRenderer[TType] | undefined> {
    await Promise.all([
      this.environment.page.waitForTimeout(200),
      this.locators.submitButton.click(),
    ]);

    return type ? this.Nodes[type] : undefined;
  }

  async back(type?: keyof NodesRenderer) {
    await this.locators.goBackButton.click();

    return type ? this.Nodes[type] : undefined;
  }
}
