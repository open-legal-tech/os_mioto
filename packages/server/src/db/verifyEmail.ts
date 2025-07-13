import prisma from "@mioto/prisma";
import { getAuthTokens } from "./auth";
import { removeToken } from "../models/Token/remove";
import { verifyEmailVerificationToken } from "../models/Token/subModels/EmailVerificationToken/verify";

export const verifyEmail = async (input: { token: string }) => {
  const verifiedVerifyEmailToken = await verifyEmailVerificationToken(prisma)({
    token: input.token,
  });

  if (verifiedVerifyEmailToken instanceof Error)
    return verifiedVerifyEmailToken;

  await removeToken(prisma)({
    id: verifiedVerifyEmailToken.db.id,
  });

  await prisma.account.update({
    where: {
      userUuid: verifiedVerifyEmailToken.payload.userUuid,
    },
    data: {
      emailIsVerified: true,
    },
  });

  // const createNewContact = () =>
  //   createEmailContact({
  //     email: user.email,
  //     accessCode: user.accessCode ?? undefined,
  //     lists: verifiedVerifyEmailToken.payload.newsletter
  //       ? ["user", "newsletter"]
  //       : ["user"],
  //     removeFromLists: ["waitlist"],
  //   });

  // try {
  //   if (verifiedVerifyEmailToken.payload.previousEmail) {
  //     await updateEmailContact({
  //       email: verifiedVerifyEmailToken.payload.previousEmail,
  //       newEmail: user.email,
  //       removeFromLists: ["waitlist"],
  //     }).catch(async (e: any) => {
  //       if (e.body.code === "document_not_found") {
  //         await createNewContact();
  //       }
  //     });
  //   } else {
  //     await createNewContact();
  //   }
  // } catch (e: any) {
  //   console.error(e.body);
  // }

  return await getAuthTokens(prisma)(verifiedVerifyEmailToken.payload.userUuid);
};
