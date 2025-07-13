import { Roles } from "@mioto/prisma";
import { z } from "zod";

export const UserRoles = z.nativeEnum(Roles);

export const EmployeeInput = z.object({
  employee: z.object({
    uuid: z.string(),
    role: UserRoles,
    organizationUuid: z.string(),
    type: z.literal("employee"),
  }),
});

export const CustomerInput = z.object({
  customer: z.object({
    uuid: z.string(),
    organizationUuid: z.string(),
    type: z.literal("customer"),
  }),
});

export const AnonymusUserInput = z.object({
  anonymusUser: z.object({
    uuid: z.string(),
    organizationUuid: z.string(),
    type: z.literal("anonymusUser"),
  }),
});

export const UserInput = z.object({
  user: z.union([
    CustomerInput.shape.customer,
    EmployeeInput.shape.employee,
    AnonymusUserInput.shape.anonymusUser,
  ]),
});
