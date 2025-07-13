"use server";

import { Failure } from "@mioto/errors";
import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { isOrgSlugAvailable } from "@mioto/server/db/isOrgSlugAvailable";
import { redirect } from "../../../../i18n/routing";
import { getLocale } from "next-intl/server";

export async function updateOrgAction({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const locale = await getLocale();
  const { db, user } = await checkAuthenticated({
    onUnauthenticated: () => redirect({ href: "/auth/login", locale }),
  });

  const isSlugAvailable = await isOrgSlugAvailable({ orgSlug: slug });

  if (isSlugAvailable instanceof Failure) {
    return {
      success: false,
      failure: isSlugAvailable.body(),
    };
  }

  await db.organization.update({
    where: {
      slug: user.Organization.slug,
    },
    data: {
      slug,
      name,
    },
  });

  return redirect({ href: `/org/${slug}/dashboard`, locale });
}
