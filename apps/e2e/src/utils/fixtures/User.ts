import type { CustomerFixture, TCustomer } from "./Customer";
import type { EmployeeFixture, TEmployee } from "./Employee";

export type UserFixture = EmployeeFixture | CustomerFixture;

export type TUser = TEmployee | TCustomer;
