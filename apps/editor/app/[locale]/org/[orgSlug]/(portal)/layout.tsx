import { LoadTheme } from "@mioto/design-system/LoadTheme";
import { setRequestLocale } from "@mioto/locale/server";
import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import OrgAnalyticsProvider from "./shared/RendererAnalyticsProvider";

export default async function RendererLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string; orgSlug: string }>;
}) {
  const params = await props.params;

  const { locale, orgSlug } = params;

  const { children } = props;

  setRequestLocale(locale);

  const unknownUser = await getUnknownUser();

  const org = await unknownUser.db.organization.findUnique({
    where: { slug: orgSlug },
    select: {
      analyticsKey: true,
      Theme: {
        select: {
          content: true,
        },
      },
    },
  });

  const theme = org?.Theme;

  const Content = (
    <>
      {theme ? <LoadTheme theme={theme} name="org-theme" /> : null}
      <div className={`h-[100dvh] org-theme`}>{children}</div>
    </>
  );

  if (org?.analyticsKey) {
    return (
      <OrgAnalyticsProvider analyticsKey={org.analyticsKey}>
        {Content}
      </OrgAnalyticsProvider>
    );
  }

  return Content;
}
