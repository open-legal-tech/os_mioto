"use server";

import { Failure } from "@mioto/errors";
import { getCurrentEmployee } from "../db/getCurrentEmployee";
import { sendEmail } from "@mioto/email/sendEmail";
import { render } from "@mioto/email/render";
import CustomerInvite from "@mioto/email/CustomerInvite";
import { createCustomerInviteLink } from "../models/utils/createCustomerInviteLink";

export async function sendCustomerInviteEmail({
  customerEmail,
  customerUuid,
}: {
  customerEmail: string;
  customerUuid: string;
}) {
  const { user } = await getCurrentEmployee();

  const inviteLink = createCustomerInviteLink(
    user.Organization.slug,
    customerUuid,
  );

  const result = await sendEmail({
    email: customerEmail,
    message: await render(
      <CustomerInvite
        inviteLink={inviteLink}
        orgName={user.Organization.name}
      />,
    ),
    subject: "Invite",
  });

  if (result instanceof Failure) {
    return { success: false, failure: result.body() };
  }

  return { success: true };
}
