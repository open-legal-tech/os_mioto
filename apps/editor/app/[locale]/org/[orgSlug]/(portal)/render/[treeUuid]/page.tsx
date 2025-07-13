import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import { getOrgBySlug } from "@mioto/server/db/getOrgBySlug";
import { emptySession } from "@mioto/workflow-builder/constants";
import { notFound } from "next/navigation";
import { NewSession } from "./NewSession";
import { createAnonymusRendererSession } from "./createAnonymusRendererSession";

type Params = {
  params: Promise<{
    orgSlug: string;
    treeUuid: string;
  }>;
};
export default async function Page(props: Params) {
  const params = await props.params;

  const { orgSlug, treeUuid } = params;

  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const auth = await checkAuthenticated();

  const { user, session } =
    auth === "unauthenticated"
      ? await createAnonymusRendererSession(org.uuid, treeUuid)
      : {
          user: auth.user,
          session: await auth.db.session.create({
            data: {
              name: "Anonymus",
              state: emptySession,
              status: "IN_PROGRESS",
              treeUuid,
              ownerUuid: auth.user.uuid,
            },
            include: { Tree: { select: { name: true } } },
          }),
        };

  return (
    <NewSession
      userUuid={user.uuid}
      treeUuid={session.treeUuid}
      sessionUuid={session.uuid}
      treeName={session.Tree.name}
      orgSlug={orgSlug}
    />
  );
}
