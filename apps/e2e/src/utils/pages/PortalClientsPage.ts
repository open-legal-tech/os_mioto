import { FatalError } from "@mioto/errors";
import { ClientMenu } from "../components/ClientMenu";
import { PortalSettings } from "../components/PortalSettings";
import type { CustomerFixture } from "../fixtures/Customer";
import { CustomerSzenario } from "../szenarios/CustomerSzenario";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";
import { OrganizationRegistrationPageModel } from "./OrganizationRegistrationPageModel";

export class PortalClientsPageModel<TData extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TData>;

  get meta() {
    return {
      isAuthenticated: true,
      isTracked: true,
      url: `/org/${this.szenario.employee.organization.slug}/clients/portal`,
    };
  }

  get Settings() {
    return new PortalSettings(this.szenario.environment);
  }

  get locators() {
    return {
      settingsTab: this.szenario.environment.page.getByRole("tab", {
        name: "Einstellungen",
      }),
      addClientButton: this.szenario.environment.page.getByRole("button", {
        name: "Mandanten hinzufügen",
      }),
      configureClientPortalLink: this.szenario.environment.page.getByRole(
        "link",
        { name: "Mandantenportal konfigurieren" },
      ),
      addClientDialog: {
        container: this.szenario.environment.page.getByRole("dialog", {
          name: "Neuer Mandant",
        }),
        emailInput: this.szenario.environment.page.getByRole("textbox", {
          exact: true,
          name: "E-Mail",
        }),
        firstNameInput: this.szenario.environment.page.getByRole("textbox", {
          name: "Vorname",
        }),
        lastNameInput: this.szenario.environment.page.getByRole("textbox", {
          name: "Nachname",
        }),
        companyInput: this.szenario.environment.page.getByRole("textbox", {
          name: "Unternehmen",
        }),
        referenceInput: this.szenario.environment.page.getByRole("textbox", {
          name: "Referenznummer",
        }),
        portalAccessCheckbox: this.szenario.environment.page.getByRole(
          "checkbox",
          {
            name: "Mandant Portalzugang freigeben (auch später möglich)",
          },
        ),
        notifyCheckbox: this.szenario.environment.page.getByRole("checkbox", {
          name: "Mandant via E-Mail über Portalzugang informieren",
        }),
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "Speichern",
          exact: true,
        }),
        cancelButton: this.szenario.environment.page.getByRole("button", {
          name: "Abbrechen",
        }),
        submitAndNextButton: this.szenario.environment.page.getByRole(
          "button",
          {
            name: "Speichern und weiteren Klienten hinzufügen",
          },
        ),
      },
    };
  }

  ClientCard(clientName: string) {
    return new ClientMenu(this.szenario.environment, clientName);
  }

  constructor(szenario: EmployeeSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async gotoConfigureClientPortal() {
    await this.locators.settingsTab.click();

    return this.Settings;
  }

  async createNewCustomer(newClient: ReturnType<CustomerFixture["create"]>) {
    await this.locators.addClientButton.click();

    const ClientDialog = this.locators.addClientDialog;
    await ClientDialog.emailInput.fill(newClient.account.email);
    await ClientDialog.firstNameInput.fill(newClient.customer.firstname);
    await ClientDialog.lastNameInput.fill(newClient.customer.lastname);
    await ClientDialog.companyInput.fill(newClient.customer.company);
    await ClientDialog.referenceInput.fill(newClient.customer.referenceNumber);
    await ClientDialog.notifyCheckbox.check();

    await ClientDialog.submitButton.click();

    const newContext = await this.szenario.environment.browser.newContext();
    const newPage = await newContext.newPage();
    const customerSzenario = new CustomerSzenario(
      { ...this.szenario.environment, context: newContext, page: newPage },
      newClient,
      this.szenario.data,
    );

    // const mail = await customerSzenario.customer.mail.getLatestMail();

    // const portalLink = mail.html?.links?.find((value) =>
    //   value.text?.includes("Portal öffnen"),
    // )?.href;

    // if (!portalLink) {
    //   throw new FatalError({ code: "missing_portal_link" });
    // }

    // await newPage.goto(portalLink);

    return {
      customerSzenario,
      CustomerRegistrationPage: new OrganizationRegistrationPageModel(
        customerSzenario,
      ),
    };
  }
}
