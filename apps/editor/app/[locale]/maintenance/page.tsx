import { getFormatter, getTranslations } from "@mioto/locale/server";
import { NotFound } from "../../shared/error/NotFound/NotFound";
import { generateMiotoMetadata } from "../../shared/generateMiotoMetadata";
import { AnalyticsProvider } from "../shared/AnalyticsProvider";
import builderEnv from "../../../env";
import { redirectToHome } from "@mioto/server/redirects/redirectToHome";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("auth.maintenance.pageTitle"),
  description: t("auth.maintenance.description"),
}));

export const dynamic = "force-dynamic";

export default async function MaintenancePage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const { locale } = await props.params;

  if (!builderEnv.MAINTENANCE_MODE) return redirectToHome();

  const format = await getFormatter({ locale });
  const t = await getTranslations({ locale });

  return (
    <AnalyticsProvider>
      <NotFound
        heading={t("maintenance.info.title")}
        content={
          <>
            {t("maintenance.info.content")}{" "}
            {builderEnv.MAINTENANCE_MODE_UNTIL
              ? t("maintenance.info.until", {
                  time: format.relativeTime(builderEnv.MAINTENANCE_MODE_UNTIL),
                })
              : null}
          </>
        }
        withBackbutton={false}
      />
    </AnalyticsProvider>
  );
}
