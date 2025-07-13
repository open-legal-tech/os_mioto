import type { EnvironmentModel } from "../environments/Environment";

export class ClientTreeCard {
  readonly environment: EnvironmentModel;
  readonly treeName: string;

  get locators() {
    return {
      title: this.environment.page.getByRole("heading", {
        name: this.treeName,
      }),
      newSession: this.environment.page.getByRole("button", {
        name: "Starten",
      }),
      overviewButton: this.environment.page.getByRole("link", {
        name: "Zur Übersicht",
      }),
      previousSession: (sessionName: string) => ({
        title: this.environment.page.getByRole("heading", {
          name: sessionName,
        }),
        continueLink: this.environment.page.getByRole("link", {
          name: "Fortsetzen",
        }),
      }),
    };
  }

  get components() {
    return {};
  }

  constructor(environment: EnvironmentModel, treeName: string) {
    this.environment = environment;
    this.treeName = treeName;
  }

  async createSession() {
    await this.locators.newSession.click();

    await this.environment.page.waitForURL(`**/render/**`);
    await this.environment.page.waitForTimeout(300);
  }
}
