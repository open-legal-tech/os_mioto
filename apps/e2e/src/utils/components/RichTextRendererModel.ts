import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class RichTextRendererModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    container: Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      container: this.environment.page.locator("data-test=richTextEditor"),
    };
  }

  async downloadFile(linkText: string) {
    const downloadPromise = this.environment.page.waitForEvent("download");

    await this.environment.page.getByRole("link", { name: linkText }).click();

    const download = await downloadPromise;
    await download.saveAs(
      `${this.environment.model.testInfo.outputDir}/${this.environment.model.testInfo.title}__${this.environment.model.testInfo.project.name}.docx`,
    );

    return download;
  }
}
