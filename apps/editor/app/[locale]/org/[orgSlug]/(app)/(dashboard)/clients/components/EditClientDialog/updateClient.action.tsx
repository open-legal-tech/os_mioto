"use server";

import { render } from "@mioto/email/render";
import { sendEmail } from "@mioto/email/sendEmail";
import CustomerEmailUpdate from "@mioto/email/CustomerEmailUpdate";
import CustomerInvite from "@mioto/email/CustomerInvite";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { z } from "zod";
import { createCustomerInviteLink } from "@mioto/server/utils/createCustomerInviteLink";
import { createEmailVerificationToken } from "@mioto/server/Token/subModels/EmailVerificationToken/create";

const zInput = z
  .object({
    uuid: z.string().uuid(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    email: z.string().email().optional(),
    referenceNumber: z.string().optional(),
    company: z.string().optional(),
    sendEmail: z.enum(["invite", "update"]).optional(),
    portalAccess: z.boolean().optional(),
  })
  .strict();

export type UpdateClientActionInput = z.infer<typeof zInput>;

export async function updateClientAction(input: UpdateClientActionInput) {
  const {
    uuid,
    sendEmail: sendEmailType,
    email,
    portalAccess,
    ...data
  } = zInput.parse(input);

  const { db, revalidatePath, user } = await getCurrentEmployee();

  const updatedCustomer = await db.customer.update({
    where: {
      userUuid: uuid,
    },
    data: {
      ...data,
      hasPortalAccess: portalAccess,
      User: {
        update: {
          Account: {
            update: {
              email,
            },
          },
        },
      },
    },
  });

  if (email) {
    if (sendEmailType === "update") {
      const emailVerificationToken = await createEmailVerificationToken(db)({
        userUuid: uuid,
      });

      await sendEmail({
        email,
        message: await render(
          <CustomerEmailUpdate
            newEmail={email}
            orgName={user.Organization.name ?? ""}
            token={emailVerificationToken}
          />,
        ),
        subject: "E-Mail aktualisiert",
      });
    }

    if (sendEmailType === "invite") {
      const inviteLink = createCustomerInviteLink(
        user.Organization.slug,
        updatedCustomer.userUuid,
      );
      await sendEmail({
        email,
        message: await render(
          <CustomerInvite
            inviteLink={inviteLink}
            orgName={user.Organization.name}
          />,
        ),
        subject: "Einladung zu Mioto",
      });
    }
  }

  revalidatePath(`/clients`);
  revalidatePath(`/clients/${uuid}`);

  return {
    success: true,
    data: { fullName: updatedCustomer.fullName },
  } as const;
}
