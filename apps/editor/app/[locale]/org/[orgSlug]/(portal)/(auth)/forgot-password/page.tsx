import { generateOrgMetadata } from "@mioto/design-system/Org";
import { setRequestLocale } from "@mioto/locale/server";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("auth.forgotPassword.pageTitle"),
}));

export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const { locale } = await props.params;

  setRequestLocale(locale);

  return <ForgotPasswordForm />;
}
