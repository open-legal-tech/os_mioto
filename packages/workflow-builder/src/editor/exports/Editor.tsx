import { LoadTheme } from "@mioto/design-system/LoadTheme";
import { Stack } from "@mioto/design-system/Stack";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import type React from "react";
import { mapValues } from "remeda";
import { ResetButton } from "../../renderer/ResetButton";
import { Renderer } from "../../renderer/exports/Renderer";
import { createSessionAction } from "../actions/createSession.action";
import { EditorHeader } from "../components/EditorHeader";
import { EditorProvider } from "../components/EditorProvider";
import { NodeSidebar } from "../components/NodeEditor/Canvas/Sidebar";
import { NodeEditor } from "../components/NodeEditor/NodeEditor";
import { PreviewContainer } from "../components/PreviewContainer";
import { SideMenu } from "../components/SideMenu";
import { editorSidebars } from "../editorSidebars";
import { workflowBuilderEnv } from "../../../env";

export async function Editor({
  treeUuid,
  onTreeNotFound,
  SideMenuBottomSlot,
  HeaderRightSlot,
}: {
  treeUuid: string;
  onTreeNotFound: () => void;
  SideMenuBottomSlot?: React.ReactNode;
  HeaderRightSlot?: React.ReactNode;
}) {
  const { db, user } = await getCurrentEmployee();

  const [tree, themes, session] = await Promise.all([
    db.tree.findUnique({
      where: { uuid: treeUuid, Employee: { some: { userUuid: user.uuid } } },
      include: {
        Snapshots: {
          select: {
            uuid: true,
          },
        },
      },
    }),
    db.theme.findMany({
      where: { organizationUuid: user.organizationUuid },
      select: {
        name: true,
        uuid: true,
        content: true,
        customCss: true,
      },
    }),
    db.session.findFirst({
      where: {
        ownerUuid: user.uuid,
        treeUuid,
      },
      select: {
        name: true,
        uuid: true,
        ownerUuid: true,
        state: true,
        status: true,
        treeUuid: true,
        treeSnapshotUuid: true,
      },
    }),
  ]);

  if (!tree) {
    onTreeNotFound();
    return null;
  }

  async function onCreateSession() {
    "use server";
    return createSessionAction({ treeUuid });
  }

  const theme = themes.find(
    (theme) =>
      theme.uuid === tree.themeUuid ||
      theme.uuid === user.Organization.Theme?.uuid,
  );

  const Sidebars = mapValues(editorSidebars, (Sidebar) => {
    return <Sidebar treeUuid={treeUuid} />;
  });

  return (
    <EditorProvider
      treeUuid={treeUuid}
      SYNCSERVER_ENDPOINT={workflowBuilderEnv.SYNCSERVER_ENDPOINT}
      APP_ENV={workflowBuilderEnv.APP_ENV}
    >
      {theme ? <LoadTheme theme={theme} name="renderer-theme" /> : null}
      <Stack className="bg-gray2 grid grid-cols-[56px_max-content_max-content_max-content_1fr] grid-rows-[max-content_1fr] relative h-full">
        <EditorHeader
          CLIENT_ENDPOINT={workflowBuilderEnv.CLIENT_ENDPOINT}
          RightSlot={HeaderRightSlot}
          tree={{
            name: tree.name,
            description: tree.description,
            isPublic: tree.isPublic,
            Snapshots: tree.Snapshots.map((snapshot) => snapshot.uuid),
            uuid: tree.uuid,
          }}
          themes={themes}
          treeId={treeUuid}
          className="col-span-full row-span-1"
          selectedTheme={tree.themeUuid ?? undefined}
        />
        <NodeEditor
          treeUuid={treeUuid}
          className="col-start-2 col-end-6 row-[2] isolate"
          userEmail={user.Account?.email}
          Sidebar={<NodeSidebar treeUuid={treeUuid} Sidebars={Sidebars} />}
        >
          <SideMenu
            BottomSlot={SideMenuBottomSlot}
            hasSession={!!session}
            className="col-start-[1] col-end-[2] row-[2]"
            onCreateSession={onCreateSession}
            PreviewSlot={
              <PreviewContainer session={session as any}>
                <Renderer
                  environment="private"
                  session={session as any}
                  userUuid={user.uuid}
                  RestartButton={session ? <ResetButton /> : null}
                />
              </PreviewContainer>
            }
          />
        </NodeEditor>
      </Stack>
    </EditorProvider>
  );
}
