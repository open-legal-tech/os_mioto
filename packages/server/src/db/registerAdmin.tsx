import { Failure } from "@mioto/errors";
import prisma from "@mioto/prisma";
import { hashPassword } from "@mioto/server/Auth/hasPassword";
import { z } from "zod";
import { isAccountAvailable } from "./isAccountAvailable";
import { sendEmail } from "@mioto/email/sendEmail";
import { render } from "@mioto/email/render";
import RegisterVerification from "@mioto/email/RegisterVerification";
import { generateAuthTokens } from "../models/Auth/generateAuthTokens";
import { getOrgSlug } from "../models/Auth/getOrgSlug";
import { createEmailVerificationToken } from "../models/Token/subModels/EmailVerificationToken/create";
import { LegalDocumentVersions } from "../models/User/shared";

export const registerInput = z.object({
  newsletter: z.boolean().optional(),
  email: z.string().email(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  company: z.string().optional(),
  accessCode: z.string().optional(),
  legal: LegalDocumentVersions,
  password: z.string(),
  orgName: z.string(),
  orgSlug: z.string(),
});

export const register = async (input: TRegisterInput) => {
  const accountAvaible = await isAccountAvailable({ email: input.email });

  if (accountAvaible instanceof Failure) return accountAvaible;

  const organization = await prisma.organization.create({
    data: {
      slug: input.orgSlug,
      name: input.orgName,
      ClientPortal: {
        create: {},
      },
      Users: {
        create: {
          role: "ADMIN",
          status: "ACTIVE",
          Account: {
            create: {
              termsVersion: input.legal.termsVersion,
              privacyVersion: input.legal.privacyVersion,
              email: input.email,
              password: await hashPassword(input.password),
            },
          },
          Employee: {
            create: {
              accessCode: input.accessCode,
              firstname: input.firstname,
              lastname: input.lastname,
            },
          },
        },
      },
    },
    include: {
      Users: {
        include: { Account: true, Organization: { select: { slug: true } } },
      },
    },
  });

  const adminUser = organization.Users[0];

  if (!adminUser)
    throw new Error(
      "Admin user not found after creation. This is a bug with prisma.",
    );

  const verifyEmailToken = await createEmailVerificationToken(prisma)({
    userUuid: adminUser.uuid,
    newsletter: input.newsletter,
  });

  if (!adminUser.Account)
    throw new Error(
      "Account not found after creation. This is a bug with prisma.",
    );

  await sendEmail({
    message: await render(<RegisterVerification token={verifyEmailToken} />),
    email: adminUser.Account.email,
    subject: "Registration Mioto",
  }).catch((error: any) => console.error(error?.body));

  const newTokens = await generateAuthTokens(prisma)(
    adminUser.uuid,
    adminUser.Organization.slug,
  );

  const org = await getOrgSlug(prisma)(adminUser.organizationUuid);

  if (org instanceof Failure) throw org;

  return {
    tokens: { ...newTokens, refresh: newTokens.refresh },
    org,
    user: { ...adminUser, Account: adminUser.Account },
  };
};

export type TRegisterInput = z.infer<typeof registerInput>;
