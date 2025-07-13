import { IconButton } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import { useTranslations } from "@mioto/locale";
import {
  ArrowCounterClockwise,
  ArrowLeft,
  ArrowRight,
  CornersOut,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react/dist/ssr";
import { useReactFlow } from "@xyflow/react";
import { useKey } from "react-use";
import { useEditorHistory, useTreeContext } from "../../../../tree/sync/state";
import { useEditor } from "../../../useEditor";

type Props = { className?: string };

export function EditorToolbar({ className }: Props) {
  const t = useTranslations();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { removeSelectedNodes } = useEditor();
  const { undo, redo } = useTreeContext();
  const { canRedo, canUndo } = useEditorHistory();

  useKey(
    (event) =>
      (event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === "z",
    undo,
  );

  useKey(
    (event) =>
      (event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z",
    redo,
  );

  return (
    <Row className={`gap-2 ${className}`}>
      <Row className={`bg-gray1 rounded p-1 border border-gray5`}>
        <IconButton
          tooltip={{
            children: canUndo
              ? t("app.editor.toolbar.undo.hiddenLabel.enabled")
              : t("app.editor.toolbar.undo.hiddenLabel.disabled"),
          }}
          onClick={() => undo()}
          variant="tertiary"
          square
          colorScheme="gray"
          disabled={!canUndo}
        >
          <ArrowLeft />
        </IconButton>
        <IconButton
          tooltip={{
            children: canRedo
              ? t("app.editor.toolbar.redo.hiddenLabel.enabled")
              : t("app.editor.toolbar.redo.hiddenLabel.disabled"),
          }}
          onClick={() => redo()}
          variant="tertiary"
          colorScheme="gray"
          square
          disabled={!canRedo}
        >
          <ArrowRight />
        </IconButton>
      </Row>
      <Row className={`bg-gray1 rounded p-1 border border-gray5`}>
        <IconButton
          onClick={() => zoomIn({ duration: 200 })}
          variant="tertiary"
          square
          colorScheme="gray"
          tooltip={{ children: t("app.editor.toolbar.zoomIn.hiddenLabel") }}
        >
          <MagnifyingGlassPlus />
        </IconButton>
        <IconButton
          onClick={() => zoomOut({ duration: 200 })}
          variant="tertiary"
          square
          colorScheme="gray"
          tooltip={{ children: t("app.editor.toolbar.zoomOut.hiddenLabel") }}
        >
          <MagnifyingGlassMinus />
        </IconButton>
        <IconButton
          onClick={() => {
            fitView({
              duration: 200,
              includeHiddenNodes: true,
              maxZoom: 1,
              minZoom: 0.3,
              padding: 1,
            });
            removeSelectedNodes();
          }}
          variant="tertiary"
          square
          colorScheme="gray"
          tooltip={{ children: t("app.editor.toolbar.fitView.hiddenLabel") }}
        >
          <CornersOut />
        </IconButton>
        <IconButton
          onClick={() => {
            fitView({ duration: 200, maxZoom: 1, includeHiddenNodes: true });
            removeSelectedNodes();
          }}
          variant="tertiary"
          square
          colorScheme="gray"
          tooltip={{ children: t("app.editor.toolbar.reset-zoom.tooltip") }}
        >
          <ArrowCounterClockwise />
        </IconButton>
      </Row>
    </Row>
  );
}
