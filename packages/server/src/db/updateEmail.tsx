import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";
import { isAccountAvailable } from "./isAccountAvailable";
import { sendEmail } from "@mioto/email/sendEmail";
import { render } from "@mioto/email/render";
import EmailChangeVerification from "@mioto/email/EmailChangeVerification";
import { createEmailVerificationToken } from "../models/Token/subModels/EmailVerificationToken/create";

export async function updateEmail({
  newEmail,
  userUuid,
}: {
  newEmail: string;
  userUuid: string;
}) {
  const existingAccount = await isAccountAvailable({
    email: newEmail,
  });

  if (existingAccount instanceof Failure)
    return {
      success: false,
      failure: existingAccount.body(),
    } as const;

  await Promise.all([
    prisma.account.update({
      where: { userUuid },
      data: { email: newEmail },
    }),
    (async () => {
      const verifyEmailToken = await createEmailVerificationToken(prisma)({
        userUuid,
      });

      await sendEmail({
        email: newEmail,
        message: await render(
          <EmailChangeVerification token={verifyEmailToken} />,
        ),
        subject: "E-Mail Update",
      });
    })(),
  ]);

  return { success: true } as const;
}
