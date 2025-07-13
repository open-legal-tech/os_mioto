import type { Browser, BrowserContext, Page, TestInfo } from "@playwright/test";
import { Notification } from "../components/NotificationComponent";
import { CustomerFixture } from "../fixtures/Customer";
import { EmployeeFixture } from "../fixtures/Employee";
import { TreeFixture } from "../fixtures/Tree";

export type createEnvironmentParams = {
  page: Page;
  context: BrowserContext;
  testInfo: TestInfo;
  browser: Browser;
};

export type EnvironmentModelParams = {
  Tree: TreeFixture;
  Employee: EmployeeFixture;
  Customer: CustomerFixture;
} & createEnvironmentParams;

export class EnvironmentModel {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly Employee: EmployeeFixture;
  readonly Tree: TreeFixture;
  readonly Customer: CustomerFixture;
  readonly testInfo: TestInfo;
  readonly browser: Browser;

  get Notification() {
    return (title: string) => new Notification(this, title);
  }

  constructor({
    page,
    context,
    Employee,
    Tree,
    Customer,
    testInfo,
    browser,
  }: EnvironmentModelParams) {
    this.page = page;
    this.context = context;
    this.Employee = Employee;
    this.Tree = Tree;
    this.Customer = Customer;
    this.testInfo = testInfo;
    this.browser = browser;
  }

  get model() {
    return {
      page: this.page,
      context: this.context,
      Tree: this.Tree,
      Employee: this.Employee,
      Customer: this.Customer,
      testInfo: this.testInfo,
    };
  }
}

export const createEnvironment = (params: createEnvironmentParams) => {
  const Employee = new EmployeeFixture();
  const Tree = new TreeFixture();
  const Customer = new CustomerFixture();

  return new EnvironmentModel({ ...params, Employee, Tree, Customer });
};
