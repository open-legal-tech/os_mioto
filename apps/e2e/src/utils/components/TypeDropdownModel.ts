import de from "@mioto/locale/de" with { type: "json" };
import type { EnvironmentModel } from "../environments/Environment";
import { type Nodes, nodes } from "./nodeModels/Nodes";
import type { NodeOptions } from "./shared";

export class TypeDropdownModel {
  readonly environment: EnvironmentModel;
  readonly type: NodeOptions;
  readonly nodes: Nodes;
  readonly nodeName: string;

  constructor(
    environment: EnvironmentModel,
    type: NodeOptions,
    nodeName: string,
  ) {
    this.environment = environment;

    this.type = type;
    this.nodes = nodes(environment);
    this.nodeName = nodeName;
  }

  get locators() {
    return {
      dropdown: () =>
        this.environment.page.getByRole("button", {
          name: de.common.nodeNames[this.type].short,
          exact: true,
        }),
      option: (newType: NodeOptions) =>
        this.environment.page.getByRole("menuitem", {
          name: de.common.nodeNames[newType].short,
        }),
    };
  }

  async selectOption<TType extends keyof typeof this.nodes>(newType: TType) {
    await this.locators.dropdown().click();

    await this.locators.option(newType).click();

    return this.nodes[newType](this.nodeName) as ReturnType<
      (typeof this.nodes)[TType]
    >;
  }
}
