import LinkWithAnimatedArrow from "@mioto/design-system/LinkWithAnimatedArrow";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import { footerClasses } from "../../../shared/AuthCard";
import { generateMiotoMetadata } from "../../../shared/generateMiotoMetadata";
import { StepForm } from "./StepForm";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("auth.register.pageTitle"),
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
    <>
      <StepForm className="flex-1 justify-center" />
      <footer className={`${footerClasses} py-4 flex-0`}>
        <span className="mr-2">
          {t("auth.register.register-form.loginCTA.question")}
        </span>
        <LinkWithAnimatedArrow href="/auth/login" emphasize="weak">
          {t("auth.register.register-form.loginCTA.link")}
        </LinkWithAnimatedArrow>
      </footer>
    </>
  );
}
