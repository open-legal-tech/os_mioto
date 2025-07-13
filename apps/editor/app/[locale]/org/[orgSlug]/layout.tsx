import { OrgProvider } from "@mioto/design-system/Org";
import { setRequestLocale } from "@mioto/locale/server";

export default async function OrgLayout(
  props: {
    children: React.ReactNode;
  } & {
    params: {
      orgSlug: string;
      locale: string;
    };
  }
) {
  const params = await props.params;

  const {
    orgSlug,
    locale
  } = params;

  const {
    children
  } = props;

  setRequestLocale(locale);

  return (
    <OrgProvider orgSlug={orgSlug}>
      <div className="h-[100dvh]">{children}</div>
    </OrgProvider>
  );
}
