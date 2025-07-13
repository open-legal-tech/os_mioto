"use server";

import { Failure } from "@mioto/errors";
import { LegalDocumentVersions } from "@mioto/server/User/shared";
import { setTokenCookies } from "@mioto/server/db/checkAuthenticated";
import { registerCustomer } from "@mioto/server/db/registerCustomer";
import { z } from "zod";
import { redirect } from "../../../../../../../i18n/routing";
import { getLocale } from "next-intl/server";

const registerCustomerInput = z.object({
  userUuid: z.string(),
  password: z.string(),
  legal: LegalDocumentVersions,
});

type TRegisterCustomerInput = z.infer<typeof registerCustomerInput>;

export async function registerCustomerAction(inputs: TRegisterCustomerInput) {
  const parsedInputs = registerCustomerInput.parse(inputs);

  const result = await registerCustomer(parsedInputs);

  if (result instanceof Failure)
    return { success: false, failure: result.body() } as const;

  await setTokenCookies(result.tokens);

  return redirect({
    href: `/org/${result.user.User.Organization.slug}/client`,
    locale: await getLocale(),
  });
}
