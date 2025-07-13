import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { t } from "../translator";

export class NodeMenuModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    menuButton: Locator;
    menu: Locator;
    deleteOption: Locator;
    startNodeOption: Locator;
    duplicateNodeOption: Locator;
    finalNodeOption: {
      add: Locator;
      remove: Locator;
    };
  };
  readonly nodeName: string;

  constructor(environment: EnvironmentModel, nodeName: string) {
    this.environment = environment;

    this.nodeName = nodeName;

    this.locators = {
      menuButton: environment.page.locator(
        `text=${t("packages.node-editor.node-menu.iconLabel", {
          name: this.nodeName,
        })}`,
      ),
      menu: environment.page.getByRole("menu", { name: "Blockmenü" }),
      deleteOption: environment.page.getByRole("menuitem", {
        name: de.packages["node-editor"]["node-menu"].deleteNode.label,
      }),
      startNodeOption: environment.page.getByRole("menuitem", {
        name: de.packages["node-editor"]["node-menu"].makeStartNode.label,
      }),
      duplicateNodeOption: environment.page.getByRole("menuitem", {
        name: de.packages["node-editor"]["node-menu"].duplicateNode.label,
      }),
      finalNodeOption: {
        add: environment.page.getByRole("menuitem", {
          name: de.packages["node-editor"]["node-menu"].endNode.add.label,
        }),
        remove: environment.page.getByRole("menuitem", {
          name: de.packages["node-editor"]["node-menu"].endNode.remove.label,
        }),
      },
    };
  }

  async open() {
    if (!(await this.locators.menu.isVisible()))
      await this.locators.menuButton.click();
  }

  async close() {
    await this.locators.menuButton.click({ force: true });
  }

  async deleteNode() {
    await this.open();
    await this.locators.deleteOption.click();
  }

  async makeStartNode() {
    await this.open();
    await this.locators.startNodeOption.click();
  }

  async makeFinalNode() {
    await this.open();
    await this.locators.finalNodeOption.add.click();
  }

  async removeFinalNode() {
    await this.open();
    await this.locators.finalNodeOption.remove.click();
  }

  async duplicateNode() {
    await this.open();
    await this.locators.duplicateNodeOption.click();
  }
}
