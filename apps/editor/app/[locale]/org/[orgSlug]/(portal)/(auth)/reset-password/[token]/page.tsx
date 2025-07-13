import Link from "@mioto/design-system/Link";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { useTranslations } from "@mioto/locale";
import { getTranslations, setRequestLocale } from "@mioto/locale/server";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import {
  containerClasses,
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../../../../../../../shared/AuthCard";
import { ResetPasswordForm } from "../ResetPasswordForm";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("auth.resetPassword.pageTitle"),
}));

type Params = { params: Promise<{ token: string; locale: string }> };

export default async function Page(props: Params) {
  const params = await props.params;

  const { token, locale } = params;

  const t = await getTranslations({ locale });
  setRequestLocale(locale);

  return token ? (
    <div
      className={containerClasses(
        "max-w-[500px] lg:w-[500px] justify-center flex-1",
      )}
    >
      <header className={headerClasses}>
        <h2 className={headingClasses}>{t("auth.resetPassword.title")}</h2>
        <p className={descriptionClasses}>
          {t("auth.resetPassword.description")}{" "}
        </p>
      </header>
      <main>
        <ResetPasswordForm token={token} />
      </main>
    </div>
  ) : (
    <div
      className={containerClasses(
        "max-w-[500px] lg:w-[500px] justify-center flex-1",
      )}
    >
      <header className={headerClasses}>
        <h2 className={headingClasses}>
          {t("auth.resetPassword.invalid.title")}
        </h2>
        <p className={descriptionClasses}>
          {t("auth.resetPassword.invalid.description")}{" "}
        </p>
      </header>
      <footer className="flex flex-row items-center mt-4 gap-2 flex-0">
        <ArrowRight />
        <Link href="/auth/forgot-password" size="large">
          {t("auth.resetPassword.invalid.retry")}
        </Link>
      </footer>
    </div>
  );
}
