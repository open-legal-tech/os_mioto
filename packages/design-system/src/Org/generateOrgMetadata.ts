import type { TranslationFn } from "@mioto/locale";
import { redirect } from "next/navigation";
import { getTranslations } from "@mioto/locale/server";
import { dangerousFullAccessPrisma } from "@mioto/server/db/prisma";

type Params = { orgSlug: string; locale: string };
type Data = { title: string };

export const generateOrgMetadata =
  (fn: (t: TranslationFn) => Data) =>
  async ({ params }: { params: Params | Promise<Params> }) => {
    const { orgSlug, locale } = await params;

    const t = await getTranslations({ locale });

    const org = await dangerousFullAccessPrisma.organization.findUnique({
      where: { slug: orgSlug },
      select: { name: true },
    });

    if (!org) return redirect(`/`);

    const { title } = fn(t);

    return {
      title: `${title}${org.name ? ` | ${org.name}` : ""}`,
    };
  };
