import type { Locator } from "@playwright/test";
import { EnvironmentModel } from "../../environments/Environment";
import { TargetSelectorDropdown } from "../TargetSelectorDropdown";
import { VariableDropdownModel } from "../VariableDropdownModel";
import { MultiSelectConditionConfigurator } from "./MultiSelectConditionConfigurator";
import { NumberConditionConfigurator } from "./NumberConditionConfigurator";
import { SelectConditionConfigurator } from "./SelectConditionConfigurator";

const Configurators = {
  number: NumberConditionConfigurator,
  select: SelectConditionConfigurator,
  "multi-select": MultiSelectConditionConfigurator,
} as const;

export class ConditionCardModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    configureConditionButton: Locator;
    variableDropdown: VariableDropdownModel;
    menu: ConditionMenu;
  };

  constructor(environment: EnvironmentModel, { title }: { title: string }) {
    this.environment = environment;

    const container = this.environment.page
      .getByRole("list", {
        name: "Verbindungen",
      })
      .getByRole("listitem", { name: title });

    this.locators = {
      /**
       * @param title The title of the condition. Defaults to the title of an
       * empty condition "Bedingung konfigurieren". Please provide the title
       * if the condition is not empty.
       */
      configureConditionButton: container.getByRole("button", {
        name: "Bedingung konfigurieren",
      }),
      variableDropdown: new VariableDropdownModel(
        environment,
        "Variable auswählen",
      ),
      menu: new ConditionMenu(environment, { container }),
    };
  }

  async toggleConditionConfigurator() {
    await this.locators.configureConditionButton.click();
  }

  async toggleVariableDropdown() {
    await this.locators.variableDropdown.locators.button.click();
  }

  async selectVariable<TKey extends keyof typeof Configurators>(
    text: string,
    type: TKey,
  ) {
    await this.toggleVariableDropdown();
    await this.locators.variableDropdown.selectVariable(text);

    return new Configurators[type](this.environment) as InstanceType<
      (typeof Configurators)[TKey]
    >;
  }
}

class ConditionMenu extends EnvironmentModel {
  readonly locators: {
    trigger: Locator;
    menu: Locator;
    item: (title: string) => Locator;
  };

  constructor(model: EnvironmentModel, { container }: { container: Locator }) {
    super(model);

    const menu = this.page.getByRole("menu", { name: "Verbindungsmenü" });

    this.locators = {
      trigger: container.getByRole("button", { name: "Verbindungsmenü" }),
      menu,
      item: (title) => {
        return menu.getByRole("menuitem", { name: title });
      },
    };
  }

  async open() {
    if (!(await this.locators.menu.isVisible())) {
      await this.locators.trigger.click();
    }
  }

  async openTargetMenu() {
    await this.open();
    await this.locators.item("Zielblock auswählen").click();

    return new TargetSelectorDropdown(this);
  }

  async selectTarget(title: string) {
    const TargetSelectorDropdown = await this.openTargetMenu();

    await TargetSelectorDropdown.selectItem(title);
  }

  async toggleFallback() {
    await this.open();
    await this.locators.item("Rückfallverbindung").click();
  }
}
