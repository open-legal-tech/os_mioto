import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { t } from "../translator";
import { type Nodes, nodes } from "./nodeModels/Nodes";

export class CreateNodeDropdown {
  readonly environment: EnvironmentModel;
  readonly locators: {
    menu: Locator;
    menuItem: (type: keyof ReturnType<typeof nodes>) => Locator;
  };

  readonly nodes: Nodes;

  constructor(environment: EnvironmentModel, menuLabel?: string) {
    this.environment = environment;

    this.locators = {
      menu: this.environment.page.getByRole("menu", {
        name: menuLabel ?? de.app.editor.createNodeButton.tooltip,
      }),
      menuItem: (type) =>
        this.locators.menu.getByRole("menuitem", {
          name: t(`common.nodeNames.${type}.short`),
        }),
    };

    this.nodes = nodes(environment);
  }

  async selectOption<TType extends keyof Nodes>(type: TType) {
    await this.locators.menuItem(type).click();

    return this.nodes[type] as Nodes[TType];
  }
}
