import { AnalyticsBanner } from "../components/AnalyticsBanner";
import { ContactForm } from "../components/ContactForm";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class ContactPageModel<TData extends SzenarioData> {
  readonly szenario: BaseSzenario<TData>;

  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/kontakt",
    };
  }

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
      ContactForm: new ContactForm(this.szenario.environment),
    };
  }

  constructor(szenario: BaseSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
