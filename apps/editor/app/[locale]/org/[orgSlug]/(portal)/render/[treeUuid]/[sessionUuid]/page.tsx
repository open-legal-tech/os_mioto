import { InfoBox } from "@mioto/design-system/InfoBox";
import { LoadTheme } from "@mioto/design-system/LoadTheme";
import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { generateOrgMetadata } from "@mioto/design-system/Org";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { setRequestLocale } from "@mioto/locale/server";
import { verifyAnonymusUserToken } from "@mioto/server/Token/subModels/AnonymusUserToken/verify";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import { getUnauthorizedSession } from "@mioto/server/db/getUnauthorizedSession";
import { getTreeSnapshot } from "@mioto/workflow-builder/db/getTreeSnapshot";
import type { TActionErrors } from "@mioto/workflow-builder/interpreter/interpreterConfig";
import { Renderer } from "@mioto/workflow-builder/renderer/components/Renderer.server";
import buffer from "@mioto/workflow-builder/tree-utils/buffer";
import { TreeProvider } from "@mioto/workflow-builder/tree/TreeProvider";
import type { TModuleVariableValue } from "@mioto/workflow-builder/variables/types";
import * as Sentry from "@sentry/nextjs";
import { notFound, redirect } from "next/navigation";
import React from "react";
import validator from "validator";
import { RestartButton } from "../../../shared/RestartButton";
import { Session } from "./Session";

type Params = {
  params: Promise<{
    treeUuid: string;
    orgSlug: string;
    locale: string;
    sessionUuid: string;
  }>;
};

export const generateMetadata = generateOrgMetadata((t) => ({
  title: t("client-portal.public-renderer.pageTitle"),
}));

export default async function RenderPage(props: Params) {
  const params = await props.params;

  const {
    treeUuid,
    locale,
    sessionUuid,
    orgSlug
  } = params;

  setRequestLocale(locale);

  if (sessionUuid === "new") {
    redirect(`/org/${orgSlug}/render/${treeUuid}`);
  }

  if (!validator.isUUID(sessionUuid) || !validator.isUUID(treeUuid))
    return notFound();

  const session = await getUnauthorizedSession(sessionUuid);

  if (!session) notFound();

  const { db, user } = await checkAuthWithAnonymus(session.ownerUuid);

  const treeSnapshot = await getTreeSnapshot(db)({
    treeUuid: session.treeUuid,
  });

  if (!treeSnapshot) notFound();

  if (treeSnapshot.migrationStatus === "unfixable") {
    Sentry.captureException(
      new Error("Invalid Tree after migration in Renderer"),
      {
        level: "warning",
        tags: { type: "tree-validation" },
        extra: { fixes: treeSnapshot.fixes },
      },
    );

    return (
      <div className={`h-full grid justify-center items-center`}>
        <InfoBox
          className="max-w-[500px]"
          variant="danger"
          Title="Anwendungsfehler"
          Content="Es ist ein systemseitiger Fehler aufgetreten. Dieser wurde uns
            gemeldet und wir werden diesen schnellstmöglich beheben. Bitte
            versuchen Sie es später erneut."
        />
      </div>
    );
  }

  const treeString = buffer.toBase64(treeSnapshot.document);

  return (
    <div className={`h-full grid`}>
      {treeSnapshot?.OriginTree?.Theme ? (
        <LoadTheme
          theme={treeSnapshot.OriginTree.Theme}
          name="renderer-theme"
        />
      ) : null}
      <Stack className="h-full p-4 lg:p-8 justify-center items-center renderer-container">
        <React.Suspense
          fallback={
            <Stack className="items-center gap-2">
              <LoadingSpinner size="50px" />
              <Text size="large">Lade Session</Text>
            </Stack>
          }
        >
          <TreeProvider id={treeUuid} initialTree={treeString}>
            <Session treeUuid={treeUuid} sessionUuid={sessionUuid}>
              <Renderer
                RestartButton={<RestartButton treeUuid={treeUuid} />}
                userUuid={user.uuid}
                session={{
                  name: session.name,
                  ownerUuid: session.ownerUuid,
                  status: session.status,
                  treeSnapshotUuid: session.treeSnapshotUuid,
                  treeUuid: session.treeUuid,
                  uuid: session.uuid,
                  state:
                    session.state as unknown as TModuleVariableValue<TActionErrors>,
                }}
                environment="published"
                getAuthorization={async () => {
                  "use server";
                  return await checkAuthWithAnonymus(session.ownerUuid);
                }}
              />
            </Session>
          </TreeProvider>
        </React.Suspense>
      </Stack>
    </div>
  );
}
