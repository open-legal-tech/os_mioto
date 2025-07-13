import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";
import { UserMenuComponent } from "./UserMenuComponent";

export class HeaderComponent<TData extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TData>;
  readonly header: Locator;
  readonly userMenu: UserMenuComponent<TData>;

  constructor(szenario: EmployeeSzenario<TData>) {
    this.szenario = szenario;

    this.header = szenario.environment.page.locator(`header`);

    this.userMenu = new UserMenuComponent(szenario, this.header);
  }

  async goHome() {
    await Promise.all([
      this.szenario.environment.page.waitForURL(/.*dashboard/),
      this.szenario.environment.page
        .getByRole("link", { name: de.components.header.homeButtonHiddenLabel })
        .click(),
    ]);
  }
}
