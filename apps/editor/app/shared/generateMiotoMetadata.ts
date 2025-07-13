import type { TranslationFn } from "@mioto/locale";
import { getTranslations } from "@mioto/locale/server";
import type { Metadata } from "next";

type Params = {
  params:
    | Promise<{ orgSlug: string; locale: string }>
    | { orgSlug: string; locale: string };
};

type Data = { title: string } & Metadata;

export const generateMiotoMetadata =
  (fn: (t: TranslationFn) => Data) =>
  async ({ params }: Params) => {
    const { locale } = await params;
    const t = await getTranslations({ locale });

    const { title, ...other } = fn(t);

    return {
      title: `${title} | Mioto`,
      ...other,
    };
  };
