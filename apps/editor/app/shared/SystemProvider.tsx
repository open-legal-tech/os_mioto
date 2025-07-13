"use client";

import { IntlError, NextIntlClientProvider } from "@mioto/locale";
import * as Sentry from "@sentry/nextjs";
import { I18nProvider } from "react-aria-components";

function onError(error: any) {
  // Missing translations are expected and should only log an error
  Sentry.withScope((scope) => {
    if (error instanceof IntlError) {
      scope.setExtra("translation", "");
    }
    Sentry.setContext("message-name", error);
    Sentry.captureException(error);
  });
}

export function SystemProvider({
  locale,
  messages,
  children,
}: {
  locale: string;
  messages: any;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={locale}>
      <NextIntlClientProvider
        locale={locale}
        messages={messages}
        timeZone="Europe/Berlin"
        now={new Date()}
        onError={onError}
        defaultTranslationValues={{
          br: () => <br />,
          strong: (chunks) => (
            <span className="font-strong inline">{chunks}</span>
          ),
          weak: (chunks) => <span className="font-weak inline">{chunks}</span>,
        }}
      >
        {children}
      </NextIntlClientProvider>
    </I18nProvider>
  );
}
