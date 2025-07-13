"use client";

import { IconButton } from "@mioto/design-system/IconButton";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { useTreeClient } from "../exports/state";
import { useEditor } from "../useEditor";
import { NodeDropdown } from "./NodeDropdown";

type Props = { className?: string };

export function CreateNodeButton({ className }: Props) {
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  const { getCenter, zoomToNode, replaceSelectedNodes } = useEditor();

  return (
    <NodeDropdown
      onSelect={(plugin) => {
        const newNode = plugin.create({
          position: getCenter(),
        })(treeClient);

        treeClient.nodes.add(newNode);

        replaceSelectedNodes([newNode.id]);
        zoomToNode(newNode);
      }}
      side="right"
      sideOffset={15}
    >
      <IconButton
        variant="primary"
        className={className}
        tooltip={{
          children: t("app.editor.createNodeButton.tooltip"),
          side: "right",
          sideOffset: 20,
          delay: 0,
        }}
      >
        <Plus />
      </IconButton>
    </NodeDropdown>
  );
}
