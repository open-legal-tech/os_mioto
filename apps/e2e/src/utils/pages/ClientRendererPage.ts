import { RendererComponent } from "../components/RendererComponent";
import type { CustomerSzenario } from "../szenarios/CustomerSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class ClientRendererPage<TData extends SzenarioData> {
  readonly szenario: CustomerSzenario<TData>;

  readonly treeUuid: string;
  get meta() {
    return {
      isAuthenticated: true,
      isTracked: false,
      url: `/org/${this.szenario.customer.organization.slug}/client/render/${this.treeUuid}`,
    };
  }
  get Renderer() {
    return new RendererComponent(this.szenario.environment);
  }

  constructor(szenario: CustomerSzenario<TData>, treeUuid: string) {
    this.szenario = szenario;

    this.treeUuid = treeUuid;
  }

  getErrorLocator(text: string) {
    return this.szenario.environment.page.locator(`text=${text}`);
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
