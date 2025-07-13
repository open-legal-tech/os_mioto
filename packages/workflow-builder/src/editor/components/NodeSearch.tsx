"use client";

import Badge from "@mioto/design-system/Badge";
import { Combobox } from "@mioto/design-system/Combobox";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { useTranslations } from "@mioto/locale";
import type { INode, TNodeId } from "../../tree/exports/types";
import { useTree, useTreeClient } from "../exports/state";
import { useEditor } from "../useEditor";
import { NodeDropdown } from "./NodeDropdown";
import { NodeTypeIcon } from "./NodeTypeIcon";
import { isDefined } from "remeda";

type Props = { className?: string };

export const NodeSearch = ({ className }: Props) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const { replaceSelectedNodes } = useEditor();

  const nodeNames = useTree((treeClient) => treeClient.nodes.get.names());

  const { getCenter, zoomToNode } = useEditor();
  const combobox = Combobox.useComboboxStore();

  function changeHandler(newSelectedItemId: TNodeId) {
    replaceSelectedNodes([newSelectedItemId]);
    const node = treeClient.nodes.get.single(newSelectedItemId);

    if (!node) return;

    zoomToNode(node);
    combobox.hide();
  }

  const Item = ({
    item,
    isPromoted: _,
    ...props
  }: (
    | Parameters<Combobox.ItemSlot<INode>>[0]
    | Parameters<Combobox.GroupItemSlot<INode>>[0]
  ) &
    Combobox.ItemProps) => {
    return (
      <Combobox.Item {...props}>
        <NodeTypeIcon type={item.data.type} />
        {item.name}
      </Combobox.Item>
    );
  };

  return (
    <>
      <Combobox.Input
        store={combobox}
        placeholder={t("app.editor.nodeSearch.placeholder")}
        className={`w-[400px] ${className}`}
      />
      <Combobox.Popover
        store={combobox}
        gutter={8}
        className="max-w-[800px]"
        sameWidth
      >
        <Combobox.List
          store={combobox}
          options={Object.values(nodeNames)
            .filter(isDefined)
            .map((name) => ({
              ...name,
              type: "option",
            }))}
          CreateItem={({ value, store }) => (
            <NodeDropdown
              onSelect={(plugin) => {
                const node = plugin.create({
                  name: value,
                  position: getCenter(),
                })(treeClient);

                replaceSelectedNodes([node.id]);
                zoomToNode(node);
                treeClient.nodes.add(node);
                store.hide();
              }}
              align="start"
            >
              <button
                type="button"
                className={menuItemClasses("justify-between my-2 font-weak")}
              >
                {value}
                <Badge>{t("app.editor.nodeSearch.createBadge")}</Badge>
              </button>
            </NodeDropdown>
          )}
          Item={({ item, key, ...props }) => (
            <Item
              item={item}
              key={key}
              {...props}
              onClick={() => changeHandler(item.data.id)}
            />
          )}
          GroupItem={({ item, key, ...props }) => (
            <Item
              item={item}
              key={key}
              {...props}
              onClick={() => changeHandler(item.data.id)}
            />
          )}
        />
      </Combobox.Popover>
    </>
  );
};

export default NodeSearch;
