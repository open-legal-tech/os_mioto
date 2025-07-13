import Badge from "@mioto/design-system/Badge";
import { Button } from "@mioto/design-system/Button";
import { Combobox } from "@mioto/design-system/Combobox";
import { Notification } from "@mioto/design-system/Notification";
import { Popover } from "@mioto/design-system/Popover";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { ComplexLogicEdge } from "../../../plugins/edge/complex-logic/exports/plugin";
import type { TNodeId } from "../../../tree/id";
import { useTreeClient } from "../../../tree/sync/state";
import { NodeDropdown } from "../NodeDropdown";
import { NodeTypeIcon } from "../NodeTypeIcon";
import { sidebarButtonProps } from "../sidebarButtonProps";

export type Props = {
  options: Combobox.ListProps["options"];
  allOptions: Combobox.ListProps["allOptions"];
  nodeId: TNodeId;
};

export function CreateConnectionButton({ options, nodeId, allOptions }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const store = Combobox.useComboboxStore({
    defaultOpen: true,
  });

  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <Popover.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          store.setValue("");
        }

        return setIsOpen(open);
      }}
    >
      <Popover.Trigger asChild>
        <Button {...sidebarButtonProps} className="flex-0 min-w-max">
          <Plus />
          {t(
            "packages.node-editor.logic-configurator.create-connection-button.label",
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        className="p-2 w-[300px] max-h-[400px] overflow-y-scroll"
        align="end"
      >
        <Combobox.Input
          autoFocus
          store={store}
          placeholder={t(
            "packages.node-editor.logic-configurator.create-connection-button.combobox.input.placeholder",
          )}
          className="mb-2"
        />
        <Combobox.List
          store={store}
          options={options}
          allOptions={allOptions}
          CreateItem={(props) => {
            return (
              <NodeDropdown
                onSelect={(plugin) => {
                  const childNode = treeClient.nodes.create.childNode(
                    nodeId,
                    plugin.create({ name: props.value })(treeClient),
                  );
                  const newEdge = ComplexLogicEdge.create({
                    source: nodeId,
                    target: childNode.id,
                  })(treeClient);

                  if (newEdge instanceof Failure)
                    return Notification.add({
                      Title: newEdge.code,
                      Content: newEdge.debugMessage,
                      variant: "danger",
                    });

                  treeClient.edges.add(newEdge);
                  treeClient.nodes.add(childNode);

                  setIsOpen(false);
                  store.setValue("");
                }}
                align="start"
              >
                <Button
                  variant="tertiary"
                  {...props}
                  className={twMerge("justify-between font-weak")}
                >
                  {props.value}
                  <Badge>
                    {t(
                      "packages.node-editor.logic-configurator.create-connection-button.create-item.badge",
                    )}
                  </Badge>
                </Button>
              </NodeDropdown>
            );
          }}
          Item={({ item, key, isPromoted: _, ...props }) => {
            return (
              <Combobox.Item
                className="mx-0"
                focusOnHover
                key={key}
                {...props}
                onClick={() => {
                  const newEdge = ComplexLogicEdge.create({
                    source: nodeId,
                    target: item.id as TNodeId,
                  })(treeClient);

                  if (newEdge instanceof Failure)
                    return Notification.add({
                      Title: newEdge.code,
                      Content: newEdge.debugMessage,
                      variant: "danger",
                    });

                  treeClient.edges.add(newEdge);
                  setIsOpen(false);
                  store.setValue("");
                }}
              >
                <NodeTypeIcon type={item.data.type} />
                {item.name}
              </Combobox.Item>
            );
          }}
        />
      </Popover.Content>
    </Popover.Root>
  );
}
