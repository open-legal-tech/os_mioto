import type { EnvironmentModel } from "../environments/Environment";

export class Notification {
  readonly environment: EnvironmentModel;
  readonly title: string;

  get locators() {
    const container = this.environment.page.getByRole("region", {
      name: "Notifications (F8)",
    });

    return {
      container,
      title: container.getByRole("heading"),
      content: container.getByRole("paragraph").nth(0),
      closeButton: container.getByRole("button", { name: "Schließen" }),
      action: (label: string) => container.getByRole("button", { name: label }),
    };
  }

  constructor(environment: EnvironmentModel, title: string) {
    this.environment = environment;
    this.title = title;
  }
}
