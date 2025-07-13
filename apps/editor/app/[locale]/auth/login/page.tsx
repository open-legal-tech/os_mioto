import LinkWithAnimatedArrow from "@mioto/design-system/LinkWithAnimatedArrow";
import { Stack } from "@mioto/design-system/Stack";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import {
  descriptionClasses,
  footerClasses,
  headerClasses,
  headingClasses,
} from "../../../shared/AuthCard";
import { generateMiotoMetadata } from "../../../shared/generateMiotoMetadata";
import { LoginForm } from "./LoginForm";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("auth.login.pageTitle"),
  description: t("auth.login.description"),
}));

export default async function Login(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
    params: Promise<{ locale: string }>;
  }
) {
  const { locale } = await props.params;

  const searchParams = await props.searchParams;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const origin =
    typeof searchParams.origin === "string" ? searchParams.origin : undefined;

  return (
    <>
      <Stack className="max-w-[500px] flex-1 justify-center">
        <header className={headerClasses}>
          <h2 className={headingClasses}>
            <span className="mr-4">😊</span>
            {t("auth.login.title")}
          </h2>
          <p className={descriptionClasses}>{t("auth.login.description")}</p>
        </header>
        <main className="mt-6">
          <LoginForm redirectTo={origin} />
        </main>
      </Stack>
      <footer className={`${footerClasses} py-4 flex-0`}>
        <span className="mr-2">{t("auth.login.registerQuestion")} </span>
        <LinkWithAnimatedArrow href="/auth/register" emphasize="weak">
          {t("auth.login.registerCTA")}
        </LinkWithAnimatedArrow>
      </footer>
    </>
  );
}
