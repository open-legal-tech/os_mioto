import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../../environments/Environment";

export class OperatorDropdownModel<TOperators extends string> {
  readonly environment: EnvironmentModel;
  readonly locators: {
    operatorSelectorButton: (title?: string) => Locator;
    container: Locator;
    item: (title: string) => Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      /**
       * @param title The title of the variable. Defaults to the title of an
       * empty variable "Variable auswählen". Please provide the title
       * if the variable is not empty.
       */
      operatorSelectorButton: (title = "Operator auswählen") =>
        this.environment.page.locator("button").filter({ hasText: title }),
      container: this.environment.page.getByRole("dialog").nth(1),
      item: (operator: string) =>
        this.environment.page.getByRole("option", { name: operator }),
    };
  }

  async selectOperator(operator: TOperators) {
    await this.locators.operatorSelectorButton().click();
    await this.locators.item(operator).click();
  }
}
