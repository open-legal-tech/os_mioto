import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { TypeDropdownModel } from "./TypeDropdownModel";
import type { NodeOptions } from "./shared";

export class NodeSearch {
  readonly environment: EnvironmentModel;
  readonly input: Locator;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.input = environment.page.locator(
      `[placeholder="${de.app.editor.nodeSearch.placeholder}"]`,
    );
  }

  getOptionLocator(text: string) {
    return this.environment.page.locator(`role=option >> text=${text}`);
  }

  async selectOption(nodeName: string) {
    this.getOptionLocator(nodeName).click();
  }

  async createNode(nodeName: string, type: NodeOptions) {
    this.getOptionLocator(nodeName).click();

    await new TypeDropdownModel(this.environment, type, nodeName).locators
      .option(type)
      .click();
  }
}
