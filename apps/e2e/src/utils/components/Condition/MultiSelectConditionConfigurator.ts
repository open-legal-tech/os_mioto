import type { selectOperators } from "@mioto/workflow-builder/constants";
import type { Locator } from "@playwright/test";
import { EnvironmentModel } from "../../environments/Environment";
import { OperatorDropdownModel } from "./OperatorDropdown";

export class MultiSelectConditionConfigurator {
  readonly environment: EnvironmentModel;
  readonly operatorDropdown: OperatorDropdownModel<
    keyof typeof selectOperators
  >;
  readonly comparator: MultiSelectComparatorModel;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.operatorDropdown = new OperatorDropdownModel(environment);
    this.comparator = new MultiSelectComparatorModel(environment);
  }
}

export class MultiSelectComparatorModel extends EnvironmentModel {
  readonly locators: {
    input: Locator;
    menu: Locator;
    option: (name: string) => Locator;
  };

  constructor(environment: EnvironmentModel) {
    super(environment);

    const menu = this.page.getByRole("listbox", { name: "Auswahlliste" });

    this.locators = {
      input: this.page.getByRole("combobox", { name: "Vergleichswert" }),
      menu: menu,
      option: (name) => menu.getByRole("option", { name }),
    };
  }

  async selectOption(options: string[]) {
    await this.locators.input.click();
    await Promise.all(
      options.map(async (option) => await this.locators.option(option).click()),
    );

    await this.page.keyboard.press("Escape");
  }
}
