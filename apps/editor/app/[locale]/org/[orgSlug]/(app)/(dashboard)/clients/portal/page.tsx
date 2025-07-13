import { setRequestLocale } from "@mioto/locale/server";
import { generateMiotoMetadata } from "../../../../../../../shared/generateMiotoMetadata";
import { PortalClientList } from "./PortalClientList";
import { PortalTabs } from "./Tabs";
import { ClientPortalSettings } from "./components/ClientPortalSettings";

export const generateMetadata = generateMiotoMetadata((t) => ({
  title: t("app.client.pageTitle"),
}));

export default async function ClientPage(
  props: {
    params: Promise<{ locale: string; orgSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);

  return (
    <PortalTabs
      ClientTab={<PortalClientList orgSlug={orgSlug} />}
      SettingsTab={<ClientPortalSettings locale={locale} />}
    />
  );
}
