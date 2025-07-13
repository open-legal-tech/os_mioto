import type { EnvironmentModel } from "../environments/Environment";

export class ShareTreeDialog {
  readonly environment: EnvironmentModel;

  get locators() {
    return {
      container: this.environment.page.getByRole("dialog", {
        name: "Anwendung freigeben",
      }),
      treeSelector: {
        trigger: this.environment.page.getByRole("combobox", {
          name: "Anwendung",
        }),
        searchInput: this.environment.page.getByRole("combobox", {
          name: "Anwendungsname",
        }),
        list: this.environment.page.getByRole("listbox", {
          name: "Anwendungsliste",
        }),
        item: (name: string) =>
          this.environment.page.getByRole("option", { name }),
      },
      sessionInput: this.environment.page.getByRole("spinbutton", {
        name: "Credits",
      }),
      submit: this.environment.page.getByRole("button", { name: "Speichern" }),
      cancel: this.environment.page.getByRole("button", { name: "Abbrechen" }),
    };
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  async selectTree(name: string) {
    if (!(await this.locators.treeSelector.list.isVisible())) {
      await this.locators.treeSelector.trigger.click();
    }

    await this.locators.treeSelector.searchInput.fill(name);

    await this.locators.treeSelector.item(name).click();
  }
}
