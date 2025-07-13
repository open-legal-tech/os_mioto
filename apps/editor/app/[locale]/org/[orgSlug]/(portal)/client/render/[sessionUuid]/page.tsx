import { LoadTheme } from "@mioto/design-system/LoadTheme";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { setRequestLocale } from "@mioto/locale/server";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { getTreeSnapshot } from "@mioto/workflow-builder/db/getTreeSnapshot";
import type { TActionErrors } from "@mioto/workflow-builder/interpreter/interpreterConfig";
import { Renderer } from "@mioto/workflow-builder/renderer/components/Renderer.server";
import buffer from "@mioto/workflow-builder/tree-utils/buffer";
import { TreeProvider } from "@mioto/workflow-builder/tree/TreeProvider";
import type { TModuleVariableValue } from "@mioto/workflow-builder/variables/types";
import { notFound } from "next/navigation";

export const generateMetadata = async (
  props: {
    params: Promise<{ sessionUuid: string; orgSlug: string; locale: string }>;
  }
) => {
  const params = await props.params;

  const {
    sessionUuid,
    orgSlug,
    locale
  } = params;

  const { db } = await getCurrentUser({ orgSlug });

  const session = await db.session.findFirst({
    where: { uuid: sessionUuid },
    select: {
      name: true,
      Tree: {
        select: { name: true },
      },
    },
  });

  return generateOrgMetadata((t) => ({
    title: t("client-portal.renderer.pageTitle", {
      treeName: session?.Tree?.name ?? "Renderer",
      sessionName: session?.name,
    }),
  }))({ params: { orgSlug, locale } });
};

export default async function RenderPage(
  props: {
    params: Promise<{ sessionUuid: string; locale: string; orgSlug: string }>;
  }
) {
  const params = await props.params;

  const {
    sessionUuid,
    locale,
    orgSlug
  } = params;

  setRequestLocale(locale);
  const { user, db } = await getCurrentUser({ orgSlug });

  const session = await db.session.findUnique({
    where: {
      uuid: sessionUuid,
      ownerUuid: user.uuid,
    },
  });

  if (!session) notFound();

  const treeTheme = await db.session.findUnique({
    where: { uuid: sessionUuid },
    select: { Tree: { select: { Theme: { select: { content: true } } } } },
  });

  const treeSnapshot = await getTreeSnapshot(db)({
    treeUuid: session.treeUuid,
  });

  if (!treeSnapshot) notFound();

  if (treeSnapshot.migrationStatus === "unfixable")
    throw new Error(
      `The tree with id ${treeSnapshot.uuid} is invalid after trying to migrate.`,
    );

  const treeString = buffer.toBase64(treeSnapshot.document);

  return (
    <>
      {treeTheme?.Tree?.Theme ? (
        <LoadTheme theme={treeTheme.Tree.Theme} name="renderer-theme" />
      ) : null}
      <TreeProvider id={session.treeUuid} initialTree={treeString}>
        <Renderer
          userUuid={user.uuid}
          environment="published"
          getAuthorization={async () => {
            "use server";
            return await getCurrentUser({ orgSlug });
          }}
          session={{
            ...session,
            state:
              session.state as unknown as TModuleVariableValue<TActionErrors>,
          }}
        />
      </TreeProvider>
    </>
  );
}
