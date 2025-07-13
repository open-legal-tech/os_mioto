import { AnalyticsBanner } from "../components/AnalyticsBanner";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class LegalPage<TData extends SzenarioData> {
  readonly szenario: BaseSzenario<TData>;

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
    };
  }

  get locators() {
    return {
      confirmationButton: this.szenario.environment.page.getByRole("button", {
        name: "Akzeptieren",
      }),
    };
  }

  constructor(szenario: BaseSzenario<TData>) {
    this.szenario = szenario;
  }
}

export class PrivacyPageModel<
  TData extends SzenarioData,
> extends LegalPage<TData> {
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/privacy",
    };
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}

export class TermsPageModel<
  TData extends SzenarioData,
> extends LegalPage<TData> {
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/terms",
    };
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}

export class ImprintPageModel<
  TData extends SzenarioData,
> extends LegalPage<TData> {
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/imprint",
    };
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
