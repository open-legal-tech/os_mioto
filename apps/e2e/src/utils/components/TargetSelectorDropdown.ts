import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { CreateNodeDropdown } from "./CreateNodeDropdown";
import { type Nodes, nodes } from "./nodeModels/Nodes";

export class TargetSelectorDropdown {
  readonly environment: EnvironmentModel;
  readonly locators: {
    menu: Locator;
    item: (title: string) => Locator;
    createItem: (title: string) => Locator;
  };
  readonly nodes: Nodes;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    const menu = this.environment.page.getByRole("listbox", {
      name: "Auswahlliste",
    });

    this.locators = {
      menu,
      item: (title) => menu.getByRole("option", { name: title }),
      createItem: (title) =>
        menu.getByRole("button", { name: `${title} erstellen` }),
    };

    this.nodes = nodes(environment);
  }

  async selectItem(title: string) {
    await this.locators.item(title).click();
  }

  async createItem<TType extends keyof typeof this.nodes>(
    title: string,
    type: TType,
  ) {
    await this.locators.createItem(title).click();

    const NodeDropdown = new CreateNodeDropdown(
      this.environment,
      `${title} erstellen`,
    );

    await NodeDropdown.selectOption(type);

    return this.nodes[type](title) as ReturnType<(typeof this.nodes)[TType]>;
  }
}
