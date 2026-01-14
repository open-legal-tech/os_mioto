import { setRequestLocale } from "@mioto/locale/server";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import type React from "react";
import { LegalNotification } from "../../../(legal)/shared/LegalNotification";
// import { AnalyticsProvider } from "../../../shared/AnalyticsProvider";
import { checkMaintenanceMode } from "./shared/checkMaintenanceMode";
import { redirect } from "../../../../../i18n/routing";

type Props = {
  children: React.ReactNode;
  params: Promise<{ treeUuid: string; orgSlug: string; locale: string }>;
};

export default async function EmployeeSpaceLayout(props: Props) {
  const { locale } = await props.params;

  const { children } = props;

  await checkMaintenanceMode();
  setRequestLocale(locale);
  const { user } = await getCurrentEmployee();

  if (user.Organization.slug.includes("migration__temp-")) {
    return redirect({ href: `/auth/create-org`, locale });
  }

  return (
    <>
      {/* <AnalyticsProvider popupProps={{ shouldOptIn: true }}> */}
      <LegalNotification
        userPrivacyVersion={user.Account.privacyVersion}
        userTermsVersion={user.Account.termsVersion}
      />
      {children}
    </>
    // </AnalyticsProvider>
  );
}
