import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { IconButton } from "@mioto/design-system/IconButton";
import { useTranslations } from "@mioto/locale";
import { DotsThree, Globe, Swap, Trash } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { CopyVariableKeyMenuItem } from "../../../../editor/components/CopyVariableKeyMenuItem";
import {
  convertToRichTextJson,
  createUnproxiedYRichTextFragment,
} from "../../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TNodeId } from "../../../../tree/id";
import { useTreeClient } from "../../../../tree/sync/state";
import { createReadableKey } from "../../../../variables/exports/createReadableKey";
import type { TFormNodeInput } from "../exports/inputPlugins";
import { FormNode } from "../exports/plugin";
import type { InputPluginObject } from "../inputs/InputPlugin";
import { InputTypeDropdownContent } from "../inputs/components/InputDropdown";
import { InputGlobalVariableConnector } from "./InputGlobalVariableConnector";

type Props = {
  onDelete?: () => void;
  variableName: string[];
  disabled?: boolean;
  inputPlugins: Record<string, InputPluginObject>;
  input: TFormNodeInput;
  nodeId: TNodeId;
};

export function InputMenu({
  onDelete,
  variableName,
  disabled,
  inputPlugins,
  input,
  nodeId,
}: Props) {
  const { treeClient } = useTreeClient();
  const readableKey = `{${createReadableKey(variableName)}}`;
  const [isOpen, setIsOpen] = React.useState(false);
  const t = useTranslations();

  return (
    <DropdownMenu.Root open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          tooltip={{
            children: t("plugins.node.form.inputs.menu.tooltip"),
          }}
          variant="tertiary"
          disabled={disabled}
        >
          <DotsThree weight="bold" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <CopyVariableKeyMenuItem copyKey={readableKey} />
        <DropdownMenu.Sub>
          <DropdownMenu.SubTriggerItem Icon={<Swap />}>
            {t("plugins.node.form.inputs.menu.type-dropdown.label")}
          </DropdownMenu.SubTriggerItem>
          <DropdownMenu.SubContent>
            <InputTypeDropdownContent
              onSelect={(type) => {
                const newInput = inputPlugins[type]?.plugin.create({ t });

                if ("answers" in newInput && "answers" in input) {
                  newInput.answers = input.answers;
                }

                newInput.yRendererLabel = createUnproxiedYRichTextFragment(
                  convertToRichTextJson(input.yRendererLabel),
                );

                FormNode.inputs.update(nodeId, input, newInput)(treeClient);
              }}
            />
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        {input.type === "text" || input.type === "number" ? (
          input.globalVariableReferences ? (
            <DropdownMenu.Item
              onSelect={() => {
                FormNode.inputs.removeGlobalVariableReference(
                  nodeId,
                  input.id,
                )(treeClient);
              }}
              Icon={<Globe />}
            >
              {t("plugins.node.form.inputs.menu.global-variables.remove")}
            </DropdownMenu.Item>
          ) : (
            <DropdownMenu.Sub>
              <DropdownMenu.SubTriggerItem Icon={<Globe />}>
                {t("plugins.node.form.inputs.menu.global-variables.add")}
              </DropdownMenu.SubTriggerItem>
              <DropdownMenu.SubContent className="p-2 w-[300px] max-h-[400px] overflow-y-scroll">
                <InputGlobalVariableConnector
                  onSelect={() => setIsOpen(false)}
                  nodeId={nodeId}
                  input={input}
                />
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          )
        ) : null}
        {onDelete ? (
          <DropdownMenu.Item onSelect={onDelete} Icon={<Trash />}>
            {t("plugins.node.form.inputs.menu.remove")}
          </DropdownMenu.Item>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
