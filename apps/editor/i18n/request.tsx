import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import * as Sentry from "@sentry/nextjs";
import { IntlErrorCode } from "next-intl";
import * as React from "react";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const translations = (await import(`@mioto/locale/en`)).default;
  const defaultTranslationValues = (await import(`@mioto/locale/de`)).default;

  return {
    locale,
    messages: locale === "de" ? defaultTranslationValues : translations,

    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // Missing translations are expected and should only log an error
        console.warn(error);
      } else {
        Sentry.captureException(error);
      }
    },
    defaultTranslationValues: {
      br: () => <br />,
      strong: (chunks) => <span className="font-strong">{chunks}</span>,
      weak: (chunks) => <span className="font-weak">{chunks}</span>,
    },
    timeZone: "Europe/Berlin",
    now: new Date(),
  };
});
