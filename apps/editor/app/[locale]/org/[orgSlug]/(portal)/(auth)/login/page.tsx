import Heading from "@mioto/design-system/Heading";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import { setRequestLocale } from "@mioto/locale/server";
import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import { notFound } from "next/navigation";
import { headerClasses } from "../../../../../../shared/AuthCard";
import { ClientLoginForm } from "./LoginForm";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("client-portal.login.pageTitle"),
}));

export default async function CustomerLoginPage(
  props: {
    params: Promise<{ locale: string; orgSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);
  const { db } = await getUnknownUser();

  const org = await db.organization.findUnique({ where: { slug: orgSlug } });

  if (!org) notFound();

  return (
    <Stack className="max-w-[500px] flex-1 justify-center">
      {org.name ? (
        <header className={headerClasses}>
          <Heading size="large" className="font-serif self-center">
            {org.name}
          </Heading>
        </header>
      ) : null}
      <main className="mt-2 md:mt-6">
        <ClientLoginForm />
      </main>
    </Stack>
  );
}
