import Link from "@mioto/design-system/Link";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import { containerClasses, footerClasses } from "../../../shared/AuthCard";
import { generateMiotoMetadata } from "../../../shared/generateMiotoMetadata";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("auth.forgotPassword.pageTitle"),
}));

export default async function Page(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className={containerClasses("max-w-[500px] justify-center flex-1")}>
      <ForgotPasswordForm />
      <footer className={`${footerClasses} flex-0`}>
        <Link href="/auth/login" size="large" className="max-w-max gap-1">
          <ArrowLeft />
          {t("auth.forgotPassword.success.loginLink")}
        </Link>
      </footer>
    </div>
  );
}
