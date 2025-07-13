export * from "next-intl";

import type {
  Formats,
  MarkupTranslationValues,
  NestedKeyOf,
  NestedValueOf,
  RichTranslationValues,
  TranslationValues,
  useTranslations,
} from "next-intl";
import type { MessageKeys } from "next-intl";
import "next-intl";
import type { ReactElement } from "react";
import type { ReactNode } from "react";

type Messages = typeof import("./locales/de.json");

// eslint-disable-next-line @typescript-eslint/no-empty-interface
declare interface IntlMessages extends Messages {}

type TranslationKeys = MessageKeys<
  NestedValueOf<
    {
      "!": IntlMessages;
    },
    "!"
  >,
  NestedKeyOf<
    NestedValueOf<
      {
        "!": IntlMessages;
      },
      "!"
    >
  >
>;

type TranslationFn = ReturnType<typeof useTranslations>;

export type { TranslationFn, IntlMessages, TranslationKeys };
