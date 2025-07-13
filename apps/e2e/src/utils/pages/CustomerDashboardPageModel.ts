import { ClientTreeCard } from "../components/ClientTreeCard";
import type { CustomerSzenario } from "../szenarios/CustomerSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class CustomerDashboardPageModel<TData extends SzenarioData> {
  readonly szenario: CustomerSzenario<TData>;
  get meta() {
    return {
      isAuthenticated: true,
      isTracked: true,
      url: `/org/${this.szenario.customer.organization.slug}/client`,
    };
  }

  get locators() {
    return {
      dashboardLink: this.szenario.environment.page.getByRole("link", {
        name: "Gehe zurück zum Dashboard",
      }),
      settingsLink: this.szenario.environment.page.getByRole("link", {
        name: "Einstellungen",
      }),
    };
  }

  TreeCard(treeName: string) {
    return new ClientTreeCard(this.szenario.environment, treeName);
  }

  constructor(szenario: CustomerSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
