"use server";

import { Failure } from "@mioto/errors";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";
import { isEmailTaken } from "../db/isEmailTaken";
import { sendCustomerInviteEmail } from "./sendCustomerInviteEmail.action";
import { createCustomerInviteLink } from "../models/utils/createCustomerInviteLink";

const createCustomerInput = z.object({
  email: z.string().email(),
  referenceNumber: z.string().min(1).optional(),
  firstname: z.string().min(1).optional(),
  lastname: z.string().min(1).optional(),
  company: z.string().min(1).optional(),
  portalAccess: z.boolean().optional(),
  sendEmail: z.boolean().optional(),
});

type TCreateCustomerInput = z.infer<typeof createCustomerInput>;

export async function createCustomerAction(inputs: TCreateCustomerInput) {
  const {
    company,
    email,
    firstname,
    lastname,
    referenceNumber,
    portalAccess,
    sendEmail,
  } = createCustomerInput.parse(inputs);

  const { db, user } = await getCurrentEmployee();

  if (await isEmailTaken({ email: email })) {
    return {
      success: false,
      failure: new Failure({
        code: "email_already_used",
      }).body(),
    } as const;
  }

  const invitedCustomer = await db.customer.create({
    data: {
      firstname,
      lastname,
      referenceNumber,
      company,
      hasPortalAccess: portalAccess,
      User: {
        create: {
          Organization: { connect: { uuid: user.organizationUuid } },
          Account: {
            create: {
              email,
            },
          },
          role: "CUSTOMER",
        },
      },
    },
  });

  const inviteLink = createCustomerInviteLink(
    user.Organization.slug,
    invitedCustomer.userUuid,
  );

  if (portalAccess && sendEmail) {
    await sendCustomerInviteEmail({
      customerEmail: email,
      customerUuid: invitedCustomer.userUuid,
    });
  }

  revalidatePath(`/org/${user.Organization.slug}/clients`);

  return { success: true, data: { inviteLink } } as const;
}
