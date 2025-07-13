import { getLocale } from "next-intl/server";
import builderEnv from "../../../../../../env";
import { redirect } from "../../../../../../i18n/routing";

export async function checkMaintenanceMode() {
  const locale = await getLocale();
  const isInMaintenance = builderEnv.MAINTENANCE_MODE;

  if (isInMaintenance) {
    redirect({ href: "/maintenance", locale });
  }
}
