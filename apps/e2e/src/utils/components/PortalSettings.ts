import { expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class PortalSettings {
  readonly environment: EnvironmentModel;

  get locators() {
    return {
      agbUploadCard: {
        empty: {
          input: this.environment.page.getByLabel("AGB hochladen"),
        },
        deleteButton: this.environment.page.getByRole("button", {
          name: "AGB entfernen",
        }),
        downloadButton: this.environment.page.getByRole("link", {
          name: "AGB herunterladen",
        }),
      },
      privacyUploadCard: {
        empty: {
          input: this.environment.page.getByLabel(
            "Datenschutzerklärung hochladen",
          ),
        },
        deleteButton: this.environment.page.getByRole("button", {
          name: "Datenschutzerklärung entfernen",
        }),
        downloadButton: this.environment.page.getByRole("link", {
          name: "Datenschutzerklärung herunterladen",
        }),
      },
      logoUploadCard: {
        empty: {
          input: this.environment.page.getByLabel("Logo hochladen"),
        },
        deleteButton: this.environment.page.getByRole("button", {
          name: "Logo entfernen",
        }),
        downloadButton: this.environment.page.getByRole("link", {
          name: "Logo herunterladen",
        }),
      },
      backgroundUploadCard: {
        empty: {
          input: this.environment.page.getByLabel("Hintergrund hochladen"),
        },
        deleteButton: this.environment.page.getByRole("button", {
          name: "Hintergrund entfernen",
        }),
        downloadButton: this.environment.page.getByRole("link", {
          name: "Hintergrund herunterladen",
        }),
      },
    };
  }

  get components() {
    return {};
  }

  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  async uploadAGB(file: string) {
    await this.locators.agbUploadCard.empty.input.setInputFiles(file);

    await expect(this.locators.agbUploadCard.downloadButton).toBeVisible({
      timeout: 20000,
    });
  }

  async uploadPrivacy(file: string) {
    await this.locators.privacyUploadCard.empty.input.setInputFiles(file);

    await expect(this.locators.privacyUploadCard.downloadButton).toBeVisible({
      timeout: 20000,
    });
  }

  async uploadLogo(file: string) {
    await this.locators.logoUploadCard.empty.input.setInputFiles(file);

    await expect(this.locators.logoUploadCard.downloadButton).toBeVisible({
      timeout: 20000,
    });
  }

  async uploadBackground(file: string) {
    await this.locators.backgroundUploadCard.empty.input.setInputFiles(file);

    await expect(this.locators.backgroundUploadCard.downloadButton).toBeVisible(
      { timeout: 20000 },
    );
  }
}
