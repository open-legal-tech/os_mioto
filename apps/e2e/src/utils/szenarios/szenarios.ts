import {
  createEnvironment,
  type createEnvironmentParams,
} from "../environments/Environment";
import { LoginPageModel } from "../pages/LoginPage";
import { BaseSzenario } from "./BaseSzenario";
import { EmployeeSzenario } from "./EmployeeSzenario";

export async function createEmployeeSzenario(
  environmentParams: createEnvironmentParams,
) {
  const environment = createEnvironment(environmentParams);

  const account = await environment.Employee.insert();

  const employeeSzenario = new EmployeeSzenario(environment, account, {
    trees: {},
  });

  const LoginPage = new LoginPageModel(employeeSzenario);
  await LoginPage.goto();

  await LoginPage.login({
    email: account.account.email,
    password: account.account.password,
  });

  return employeeSzenario;
}

export async function createAnonymusSzenario(
  environmentParams: createEnvironmentParams,
) {
  const environment = createEnvironment(environmentParams);

  const szenario = new BaseSzenario(environment, { trees: {} });

  return szenario;
}

export async function createPublicTreeSzenario(
  environmentParams: createEnvironmentParams,
) {
  const environment = createEnvironment(environmentParams);

  const account = await environment.Employee.insert();
  const tree = await environment.Tree.insert({
    document: "basicTree",
    employee: { ...account.employee, ...account.user },
    isPublic: true,
  });

  await environment.Tree.createVersion(tree.uuid, account.employee.userUuid);

  const employeeSzenario = new EmployeeSzenario(environment, account, {
    trees: { publicTree: tree },
  });

  return employeeSzenario;
}

export async function createMixedTreesSzenario(
  environmentParams: createEnvironmentParams,
) {
  const environment = createEnvironment(environmentParams);

  const account = await environment.Employee.insert();
  const publicTree = await environment.Tree.insert({
    document: "basicTree",
    employee: { ...account.employee, ...account.user },
    isPublic: true,
    name: "Public Tree",
    createdAt: new Date("2023-11-28T00:00:00"),
  });

  const privateTree = await environment.Tree.insert({
    document: "basicTree",
    employee: { ...account.employee, ...account.user },
    isPublic: false,
    name: "Private Tree",
    createdAt: new Date("2023-10-29T00:00:00"),
  });

  await environment.Tree.createVersion(
    publicTree.uuid,
    account.employee.userUuid,
  );
  await environment.Tree.createVersion(
    privateTree.uuid,
    account.employee.userUuid,
  );

  const employeeSzenario = new EmployeeSzenario(environment, account, {
    trees: { publicTree, privateTree },
  });

  const LoginPage = new LoginPageModel(employeeSzenario);
  await LoginPage.goto();

  await LoginPage.login({
    email: account.account.email,
    password: account.account.password,
  });

  return employeeSzenario;
}
