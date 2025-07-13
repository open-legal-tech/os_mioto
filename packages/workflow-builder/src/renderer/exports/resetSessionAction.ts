"use server";

import { removeFile } from "@mioto/server/File/remove";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import { revalidatePath } from "next/cache";
import { emptySession } from "../../constants";

export async function resetSessionAction({
  sessionUuid,
  userUuid,
}: {
  sessionUuid: string;
  userUuid: string;
}) {
  const auth = await checkAuthWithAnonymus(userUuid);

  const [userUploads, generatedFiles] = await Promise.all([
    auth.db.userUpload.findMany({
      where: { sessionUuid },
    }),
    auth.db.generatedFile.findMany({
      where: { sessionUuid },
    }),
  ]);

  const [session] = await Promise.all([
    auth.db.session.update({
      where: { uuid: sessionUuid },
      data: {
        state: emptySession,
      },
      select: {
        ownerUuid: true,
        treeUuid: true,
        Owner: {
          select: {
            organizationUuid: true,
            Organization: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    }),
    auth.db.userUpload.deleteMany({ where: { sessionUuid } }),
    auth.db.generatedFile.deleteMany({ where: { sessionUuid } }),
    ...[
      ...generatedFiles.map((generatedFile) =>
        removeFile(auth.db)({
          uuid: generatedFile.fileUuid,
          orgUuid: auth.user.organizationUuid,
        }),
      ),
      ...userUploads.map((userUpload) =>
        removeFile(auth.db)({
          uuid: userUpload.fileUuid,
          orgUuid: auth.user.organizationUuid,
        }),
      ),
    ],
  ]);

  revalidatePath(
    `/${auth.user.Organization.slug}/client/render/${sessionUuid}`,
  );
  revalidatePath(`/${auth.user.Organization.slug}/builder/${session.treeUuid}`);

  if (session) return true;

  return false;
}
