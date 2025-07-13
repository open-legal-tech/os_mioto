"use client";
import { Button } from "@mioto/design-system/Button";
import { useLocale, useTranslations } from "@mioto/locale";
import { Translate } from "@phosphor-icons/react/dist/ssr";
import { usePathname, useRouter } from "../../../../../../../i18n/routing";

const languages = {
  de: "components.language-toogle.languages.de",
  en: "components.language-toogle.languages.en",
} as any;

export function LanguageToggle() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const toggleLanguage = () => {
    router.push(pathname, { locale: locale === "de" ? "en" : "de" });
  };

  return (
    <Button variant="tertiary" onClick={toggleLanguage}>
      <Translate /> {t(languages[locale])}
    </Button>
  );
}
