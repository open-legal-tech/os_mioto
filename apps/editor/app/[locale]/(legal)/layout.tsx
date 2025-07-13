import Logo from "@mioto/design-system/Logo";
import { Stack } from "@mioto/design-system/Stack";
import { Failure } from "@mioto/errors";
import { setRequestLocale } from "@mioto/locale/server";
import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import type * as React from "react";
import { AnalyticsProvider } from "../shared/AnalyticsProvider";
import builderEnv from "../../../env";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };

export default async function LegalLayout(props: Props) {
  const { locale } = await props.params;

  const { children } = props;

  setRequestLocale(locale);
  const user = await checkAuthenticated();

  // This is because of an markdown compilation issue with turbopack
  if (builderEnv.APP_ENV === "development") return null;

  return (
    <AnalyticsProvider popupProps={{ shouldOptIn: !(user instanceof Failure) }}>
      <Stack className="min-h-full pt-10 px-4 items-center">
        <Logo className="w-[60px] mb-6" />
        <Stack className="max-w-[800px]">{children}</Stack>
      </Stack>
    </AnalyticsProvider>
  );
}
