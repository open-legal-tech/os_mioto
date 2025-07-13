import fs from "node:fs";
import de from "@mioto/locale/de" with { type: "json" };
import { expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { test } from "../pwTest";

export class ProjectMenuComponent {
  readonly environment: EnvironmentModel;
  readonly treeName: string;

  get locators() {
    return {
      trigger: this.environment.page.getByRole("button", {
        name: `Menü für ${this.treeName}`,
      }),
      changeNameDialog: {
        option: this.environment.page.locator(
          `text=${de.components["project-menu"].changeTreeData.button}`,
        ),
        title: this.environment.page.locator(
          `text=${de.components.updateTreeDialog.title}`,
        ),
        submitButton: this.environment.page.locator(
          `button >> text=${de.components.updateTreeDialog.submit}`,
        ),
        field: {
          input: this.environment.page.locator(
            `label >> text=${de.components["tree-name-input"].label}`,
          ),
          error: this.environment.page.locator(`data-test=error-treeName`),
        },
      },

      exportDialog: {
        option: this.environment.page.locator(
          `text=${de.components["project-menu"].export.button}`,
        ),
        save: this.environment.page.getByRole("menuitem", {
          name: "Speichern",
        }),
      },

      deleteDialog: {
        option: this.environment.page.locator(
          `text=${de.components["project-menu"].deleteTree.button}`,
        ),
        title: this.environment.page.locator(
          `text=${de.components.deleteTreeDialog.title}`,
        ),
        submitButton: this.environment.page.locator(
          `button >> text=${de.components.deleteTreeDialog.submit}`,
        ),
        field: {
          input: this.environment.page.locator(
            `label >> text=${de.components["tree-name-input"].label}`,
          ),
          error: this.environment.page.locator(`data-test=error-treeName`),
        },
      },

      createVersion: {
        option: this.environment.page.getByRole("menuitem", {
          name: "Version erstellen",
        }),
        subMenuTrigger: this.environment.page.getByRole("menuitem", {
          name: "Versionen",
        }),
        spinner: this.environment.page.getByLabel("Lädt"),
      },
    };
  }

  constructor(environment: EnvironmentModel, treeName: string) {
    this.environment = environment;
    this.treeName = treeName;
  }

  async export(savePath?: string) {
    if (!(await this.locators.changeNameDialog.option.isVisible())) {
      await this.locators.trigger.click();
    }

    await this.locators.exportDialog.option.click();

    const downloadPromise = this.environment.page.waitForEvent("download");
    await this.locators.exportDialog.save.click();
    const download = await downloadPromise;

    if (savePath) {
      const file = fs.readFileSync(savePath, "utf8");

      if (file) {
        console.warn("File with id exists. Not saving!");
        return;
      }

      await download.saveAs(savePath);
    }
  }

  async changeName(newTitle: string) {
    if (!(await this.locators.changeNameDialog.option.isVisible())) {
      await this.locators.trigger.click();
    }

    if (!(await this.locators.changeNameDialog.field.input.isVisible())) {
      await this.locators.changeNameDialog.option.click();
    }

    await this.locators.changeNameDialog.field.input.fill(newTitle);
    await this.locators.changeNameDialog.submitButton.click();
  }

  async delete() {
    if (!(await this.locators.deleteDialog.option.isVisible())) {
      await this.locators.trigger.click();
    }

    if (!(await this.locators.deleteDialog.field.input.isVisible())) {
      await this.locators.deleteDialog.option.click();
    }

    await this.locators.deleteDialog.field.input.fill(this.treeName);

    await this.locators.deleteDialog.submitButton.click();
  }

  async createVersion() {
    await this.locators.trigger.click();

    if (!(await this.locators.createVersion.option.isVisible())) {
      await this.locators.createVersion.subMenuTrigger.focus();

      await this.environment.page.keyboard.press("Space");
    }

    await this.locators.createVersion.option.click();

    await expect(this.locators.createVersion.spinner).toBeHidden();
  }
}
