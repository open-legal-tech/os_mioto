import { generateOrgMetadata } from "@mioto/design-system/Org";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import { notFound } from "next/navigation";
import { latestLegalVersions } from "../../../../../../../content/legal";
import { RegisterInviteForm } from "./RegisterInviteForm";

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("client-portal.register.pageTitle"),
}));

export default async function AcceptInvitePage(
  props: {
    searchParams: Promise<{ uuid?: string }>;
    params: Promise<{ orgSlug: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    orgSlug
  } = params;

  if (!searchParams.uuid) notFound();

  const uuid = searchParams.uuid;

  const { db } = await getUnknownUser({ orgSlug, uuid, role: "CUSTOMER" });

  const user = await db.user.findUnique({
    where: {
      uuid: uuid,
    },
    select: {
      Account: { select: { email: true } },
      uuid: true,
      status: true,
      Organization: { select: { name: true } },
    },
  });

  if (!user || !user.Account) notFound();
  if (user.status !== "INVITED") {
    await getCurrentUser();
  }

  return (
    <RegisterInviteForm
      email={user.Account.email}
      legalVersions={latestLegalVersions}
      userUuid={user.uuid}
      className="flex-1 justify-center"
      orgName={user.Organization.name ?? undefined}
    />
  );
}
