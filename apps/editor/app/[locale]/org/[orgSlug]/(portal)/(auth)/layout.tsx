import Link from "@mioto/design-system/Link";
import { Row } from "@mioto/design-system/Row";
import { Failure } from "@mioto/errors";
import { setRequestLocale } from "@mioto/locale/server";
import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import Image from "next/image";
import { notFound } from "next/navigation";
import { containerClasses } from "../../../../../shared/AuthCard";
import { getPortalAssets } from "../shared/getPortalAssets";

type Props = {
  children: React.ReactNode;
  params: Promise<{ orgSlug: string; locale: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;

  const {
    orgSlug,
    locale
  } = params;

  const {
    children
  } = props;

  setRequestLocale(locale);

  const { db } = await getUnknownUser();

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: {
      homepageUrl: true,
      ClientPortal: {
        select: {
          backgroundUrl: true,
          logoUrl: true,
          logoUuid: true,
          backgroundUuid: true,
        },
      },
    },
  });

  if (!org?.ClientPortal) notFound();

  const assets = await getPortalAssets({ orgSlug });

  if (!assets) notFound();

  const Logo = assets.logoUrl ? (
    <Image
      src={assets.logoUrl}
      alt="Logo"
      fill
      style={{ objectFit: "contain" }}
      quality={75}
      priority
      sizes="10vw"
    />
  ) : (
    "Logo"
  );

  return (
    <>
      <div className="grid bg-gray1 h-full grid-rows-[100px_1fr] lg:grid-cols-[1fr_20%_min(50%,_960px)] lg:grid-rows-1 items-end isolate org-theme overflow-y-auto">
        <Row className="col-span-full row-[1] z-20 lg:z-0 h-full justify-center relative">
          {assets.backgroundUrl ? (
            <Image src={assets.backgroundUrl} alt="" fill />
          ) : null}
          {org.homepageUrl ? (
            <Link
              ghost
              href={org.homepageUrl}
              className="z-50 block p-3 rounded-bl-md lg:absolute lg:left-7 lg:top-7 relative w-[50px] lg:w-[100px] aspect-square"
              target="_blank"
            >
              {Logo}
            </Link>
          ) : (
            <div className="z-50 block p-3 rounded-bl-md lg:absolute lg:left-7 lg:top-7 relative w-[50px] lg:w-[100px] aspect-square">
              {Logo}
            </div>
          )}
        </Row>
        <div
          className={containerClasses(
            "col-span-full lg:col-start-3 lg:col-end-4 w-full h-full row-2 md:row-span-full z-10 relative border-l border-gray5",
          )}
        >
          <div className="flex justify-items-center h-full justify-center p-4 md:p-8 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
