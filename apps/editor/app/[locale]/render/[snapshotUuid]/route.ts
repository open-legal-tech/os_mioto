import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import builderEnv from "../../../../env";

export async function GET(
  _: Request,
  props: { params: Promise<{ snapshotUuid: string }> },
) {
  const params = await props.params;
  const { db } = await getUnknownUser();
  const snapshot = await db.treeSnapshot.findUnique({
    where: {
      uuid: params.snapshotUuid,
    },
    select: {
      OriginTree: {
        select: {
          uuid: true,
          Organization: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!snapshot) {
    return new Response("Not found", { status: 404 });
  }

  return Response.redirect(
    `${builderEnv.CLIENT_ENDPOINT}/org/${snapshot.OriginTree.Organization.slug}/render/${snapshot.OriginTree.uuid}/new`,
    301,
  );
}
