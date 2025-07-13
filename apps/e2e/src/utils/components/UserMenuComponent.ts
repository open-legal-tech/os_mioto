import de from "@mioto/locale/de" with { type: "json" };
import type { Locator } from "@playwright/test";
import { LoginPageModel } from "../pages/LoginPage";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class UserMenuComponent<TData extends SzenarioData> {
  readonly szenario: BaseSzenario<TData>;
  readonly button: Locator;
  readonly menuContent: Locator;

  readonly items: {
    logout: Locator;
  };

  constructor(szenario: BaseSzenario<TData>, container: Locator) {
    this.szenario = szenario;

    this.button = container.getByRole("button", {
      name: de.components["user-menu"].label,
    });

    this.menuContent = szenario.environment.page.getByRole("menu", {
      name: "Account",
    });

    this.items = {
      logout: this.menuContent.getByRole("menuitem", {
        name: de.components["user-menu"].logout,
      }),
    };
  }

  /**
   * Logs the user out and redirects him to the homepage.
   */
  async logout() {
    await this.button.click();

    await Promise.all([
      this.szenario.environment.page.waitForURL("**/auth/login"),
      this.items.logout.click(),
    ]);

    return new LoginPageModel(this.szenario);
  }
}
