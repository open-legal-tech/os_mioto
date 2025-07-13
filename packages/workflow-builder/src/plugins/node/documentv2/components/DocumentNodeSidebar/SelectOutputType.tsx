"use client";

import Badge from "@mioto/design-system/Badge";
import { baseInputClasses, textInputClasses } from "@mioto/design-system/Input";
import { labelClasses } from "@mioto/design-system/Label";
import { Row, rowClasses } from "@mioto/design-system/Row";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { overlayClasses } from "@mioto/design-system/classes/overlayClasses";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Label as ReactAriaLabel,
  Select,
  SelectValue,
} from "react-aria-components";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { DocumentNode } from "../../plugin";

export function SelectOutputType({
  className,
  nodeId,
}: {
  className?: string;
  nodeId: TNodeId;
}) {
  const { treeClient } = useTreeClient();
  const node = useTree(DocumentNode.getSingle(nodeId));
  const [open, setOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <Select
      className={rowClasses({}, ["justify-between items-center", className])}
      isOpen={open}
      onOpenChange={setOpen}
      selectedKey={node.outputAs ?? "docx"}
      onSelectionChange={(value) => {
        DocumentNode.updateOutputAs(nodeId, value as any)(treeClient);
        setOpen(false);
      }}
    >
      <ReactAriaLabel className={labelClasses({ emphasize: "weak" })}>
        {t("plugins.node.calculation.output.label")}
      </ReactAriaLabel>
      <Row className="gap-2 items-center">
        {node.outputAs === "pdf" ? (
          <Badge
            tooltip={{
              children: t(
                "plugins.node.calculation.output.alpha-disclaimer.tooltip",
              ),
            }}
          >
            Alpha
          </Badge>
        ) : null}
        <Button
          className={twMerge(
            baseInputClasses({}),
            textInputClasses(),
            "justify-between whitespace-pre-wrap min-h-[39px] p-2 gap-1",
          )}
        >
          <SelectValue />
          <CaretDown />
        </Button>
      </Row>
      <Popover className={overlayClasses}>
        <ListBox className="flex flex-col gap-1">
          <ListBoxItem className={menuItemClasses()} id="pdf">
            {t("plugins.node.document.outputAs.pdf")}
          </ListBoxItem>
          <ListBoxItem className={menuItemClasses()} id="docx">
            {t("plugins.node.document.outputAs.docx")}
          </ListBoxItem>
        </ListBox>
      </Popover>
    </Select>
  );
}
