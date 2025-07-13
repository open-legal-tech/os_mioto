import { Button } from "@mioto/design-system/Button";
import {
  DialogDefault,
  DialogRoot,
  DialogTrigger,
} from "@mioto/design-system/Dialog";
import { useTranslations } from "@mioto/locale";
import { useTree, useTreeClient } from "../../../../tree/sync/state";
import { useEditor, useEditorState } from "../../../useEditor";

export function NodeDeletionDialog({
  children,
}: {
  children?: React.ReactNode;
}) {
  const t = useTranslations();
  const { removeNodesToDelete } = useEditor();
  const { nodesToDelete } = useEditorState();

  const nodes = useTree((treeClient) =>
    treeClient.nodes.get.collection(nodesToDelete),
  );
  const { treeClient } = useTreeClient();

  return (
    <DialogRoot
      destructive
      open={nodesToDelete.length > 0}
      onOpenChange={removeNodesToDelete}
    >
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogDefault
        title="Blöcke entfernen"
        description={t("packages.node-editor.delete-nodes.dialog.heading")}
        ConfirmationButton={
          <Button
            onClick={() => {
              treeClient.nodes.delete(nodesToDelete);
              removeNodesToDelete();
            }}
          >
            {t("packages.node-editor.delete-nodes.dialog.submit")}
          </Button>
        }
      >
        {nodes ? (
          <ul>
            {Object.values(nodes).map((node) => (
              <li key={node.id}>{node.name}</li>
            ))}
          </ul>
        ) : null}
      </DialogDefault>
    </DialogRoot>
  );
}
