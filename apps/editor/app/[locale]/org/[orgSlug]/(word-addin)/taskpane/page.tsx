import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { redirect } from "../../../../../../i18n/routing";
import { getLocale } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  const locale = await getLocale();
  await checkAuthenticated({
    onUnauthenticated: () =>
      redirect({ href: `/auth/login?origin=/taskpane`, locale }),
  });

  redirect({ href: "/taskpane/intro", locale });
}
