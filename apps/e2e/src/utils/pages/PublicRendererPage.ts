import { RendererComponent } from "../components/RendererComponent";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class PublicRendererPageModel<TData extends SzenarioData> {
  readonly anonymusSzenario: BaseSzenario<TData>;
  readonly orgSlug: string;
  readonly treeId: string;

  get meta() {
    return {
      isAuthenticated: false,
      isTracked: false,
      url: `/org/${this.orgSlug}/render/${this.treeId}`,
    };
  }

  get Renderer() {
    return new RendererComponent(this.anonymusSzenario.environment);
  }

  constructor(
    anonymusSzenario: BaseSzenario<TData>,
    { treeId, orgSlug }: { orgSlug: string; treeId: string },
  ) {
    this.anonymusSzenario = anonymusSzenario;
    this.orgSlug = orgSlug;
    this.treeId = treeId;
  }

  getErrorLocator(text: string) {
    return this.anonymusSzenario.environment.page.locator(`text=${text}`);
  }

  async goto() {
    await this.anonymusSzenario.environment.page.goto(this.meta.url);
  }
}
