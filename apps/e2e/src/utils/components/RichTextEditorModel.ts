import { expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { VariableDropdownModel } from "./VariableDropdownModel";

export class RichTextEditorModel {
  readonly environment: EnvironmentModel;

  get locators() {
    const slashMenuContainer = this.environment.page.getByRole("listbox", {
      name: "Rich Text Editor Menü",
    });
    return {
      editor: this.environment.page.locator(`[data-test=richTextEditor] div`),
      label: this.environment.page.locator(`label >> text=Inhalt`),
      slashMenu: {
        container: slashMenuContainer,
        options: {
          heading: slashMenuContainer.getByRole("option", {
            name: "Überschrift",
          }),
          paragraph: slashMenuContainer.getByRole("option", {
            name: "Paragraph",
          }),
          bulletList: slashMenuContainer.getByRole("option", {
            name: "Ungeordnete Liste",
          }),
          numberedList: slashMenuContainer.getByRole("option", {
            name: "Geordnete Liste",
          }),
          toggle: slashMenuContainer.getByRole("option", { name: "Toggle" }),
          image: slashMenuContainer.getByRole("option", { name: "Bild" }),
          variable: slashMenuContainer.getByRole("option", {
            name: "Variable",
          }),
          pdfPreview: slashMenuContainer.getByRole("option", {
            name: "PDF-Vorschau",
          }),
          fileDownloadLink: slashMenuContainer.getByRole("option", {
            name: "Datei Downloadlink",
          }),
          formattedText: slashMenuContainer.getByRole("option", {
            name: "Formatierter Text",
          }),
        },
      },
    };
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  async focus() {
    await this.locators.label.click();
    await this.environment.page.waitForTimeout(100);
  }

  async fill(text: string) {
    await this.focus();
    await this.environment.page.keyboard.type(text);
  }

  async openMenu() {
    await this.focus();
    await this.environment.page.keyboard.type(" /");
    await expect(this.locators.slashMenu.container).toBeVisible();
  }

  async selectMenuOption(option: keyof typeof this.locators.slashMenu.options) {
    await this.openMenu();
    await this.locators.slashMenu.options[option].click();
  }

  async openVariableSubMenu() {
    await this.selectMenuOption("variable");

    return new VariableDropdownModel(this.environment, "Rich Text Editor Menü");
  }

  async openDownloadLinkSubMenu() {
    await this.selectMenuOption("fileDownloadLink");

    return new VariableDropdownModel(
      this.environment,
      "Dateivariable auswählen",
    );
  }

  async openPdfPreviewSubMenu() {
    await this.selectMenuOption("pdfPreview");

    return new VariableDropdownModel(this.environment, "Rich Text Editor Menü");
  }
}
