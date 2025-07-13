import { type Locator, expect } from "@playwright/test";
import {
  type EnvironmentModel,
  createEnvironment,
} from "../environments/Environment";
import { PrivacyPageModel, TermsPageModel } from "../pages/LegalPage";
import { BaseSzenario } from "../szenarios/BaseSzenario";

type LegalNotificationType = "privacy" | "terms";

const filters: Record<LegalNotificationType, string> = {
  privacy: "Datenschutzerklärung",
  terms: "AGB",
};

const pages = {
  privacy: PrivacyPageModel,
  terms: TermsPageModel,
};

export class LegalNotification<TType extends LegalNotificationType> {
  readonly environment: EnvironmentModel;
  readonly type: TType;
  readonly title: Locator;
  readonly link: Locator;
  readonly acceptButton: Locator;

  constructor(environment: EnvironmentModel, type: TType) {
    this.environment = environment;
    this.type = type;

    const notification = environment.page
      .getByRole("alert")
      .filter({ hasText: filters[type] });

    this.title = notification.getByRole("heading");
    this.link = notification.getByRole("link");
    this.acceptButton = notification.getByRole("button", {
      name: "Akzeptieren",
    });
  }

  async accept() {
    await this.acceptButton.click();
    await expect(this.acceptButton).toBeHidden();
  }

  async gotoLegalPage() {
    const [page] = await Promise.all([
      this.environment.context.waitForEvent("page"),
      await this.link.click(),
    ]);

    return new pages[this.type](
      new BaseSzenario(createEnvironment({ ...this.environment, page }), {
        trees: {},
      }),
    ) as InstanceType<(typeof pages)[TType]>;
  }
}

export const LegalNotifications = (environment: EnvironmentModel) => ({
  privacy: new LegalNotification(environment, "privacy"),
  terms: new LegalNotification(environment, "terms"),
});
