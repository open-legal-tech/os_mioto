import type { EnvironmentModel } from "../environments/Environment";
import { ShareTreeDialog } from "./ShareTreeDialog";

export class ClientMenu {
  readonly environment: EnvironmentModel;

  get locators() {
    return {
      trigger: this.environment.page.getByRole("button", {
        name: `Mandantenmenü: ${this.clientName}`,
      }),
      container: this.environment.page.getByRole("menu", {
        name: `Mandantenmenü: ${this.clientName}`,
      }),
      portal: {
        trigger: this.environment.page.getByRole("menuitem", {
          name: "Portal",
        }),
        invitation: {
          copyLink: this.environment.page.getByRole("menuitem", {
            name: "Link kopieren",
          }),
          sendEmail: this.environment.page.getByRole("menuitem", {
            name: "E-Mail senden",
          }),
        },
        shareApp: this.environment.page.getByRole("menuitem", {
          name: "Anwendung freigeben",
        }),
        block: this.environment.page.getByRole("menuitem", {
          name: "Mandant sperren",
        }),
      },
      shareSession: this.environment.page.getByRole("menuitem", {
        name: "Einzelne Session teilen",
      }),
      edit: this.environment.page.getByRole("menuitem", {
        name: "Mandant bearbeiten",
      }),
      delete: this.environment.page.getByRole("menuitem", {
        name: "Mandant löschen",
      }),
    };
  }

  get components() {
    return {
      ShareTreeDialog: new ShareTreeDialog(this.environment),
    };
  }

  readonly clientName: string;

  constructor(environment: EnvironmentModel, clientName: string) {
    this.environment = environment;
    this.clientName = clientName;
  }

  async share() {
    await this.locators.trigger.click();
    await this.locators.portal.trigger.focus();
    await this.environment.page.keyboard.press("Space");
    await this.locators.portal.shareApp.click();

    return new ShareTreeDialog(this.environment);
  }
}
