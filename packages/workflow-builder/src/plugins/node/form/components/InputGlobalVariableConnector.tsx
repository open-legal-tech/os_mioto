import { Combobox } from "@mioto/design-system/Combobox";
import { useTranslations } from "@mioto/locale";
import { pickBy } from "remeda";
import { VariableTypeIcon } from "../../../../editor/components/NodeTypeIcon";
import type { TNodeId } from "../../../../tree/id";
import { useTree, useTreeClient } from "../../../../tree/sync/state";
import { RecordVariable } from "../../../../variables/exports/types";
import {
  GlobalVariablesNode,
  type TGlobalVariableId,
} from "../../global-variables/plugin";
import type { TFormNodeInput } from "../exports/inputPlugins";
import { FormNode } from "../exports/plugin";

export function InputGlobalVariableConnector({
  nodeId,
  input,
  onSelect,
}: {
  nodeId: TNodeId;
  input: TFormNodeInput;
  onSelect: () => void;
}) {
  const store = Combobox.useComboboxStore({ defaultOpen: true });
  const options = useTree((treeClient) =>
    pickBy(
      GlobalVariablesNode.has(GlobalVariablesNode.id)(treeClient)
        ? GlobalVariablesNode.getSingle(GlobalVariablesNode.id)(treeClient)
            .variables
        : {},
      (variable) => variable.type === input.type,
    ),
  );

  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <>
      <Combobox.Input
        autoFocus
        store={store}
        placeholder={t(
          "plugins.node.form.inputs.global-variable.combobox.placeholder",
        )}
      />
      <Combobox.List
        store={store}
        options={Object.values(options ?? {}).map(
          ({ id, name, type, references }) => ({
            id,
            name,
            type: "option",
            data: { type, references },
          }),
        )}
        Item={({ item, key, isPromoted: _, ...props }) => {
          return (
            <Combobox.Item
              className="mx-0 first:mt-2"
              focusOnHover
              key={key}
              {...props}
              onClick={() => {
                FormNode.inputs.addGlobalVariableReference(
                  item.id as TGlobalVariableId,
                  RecordVariable.createChildIdPath(nodeId, input.id),
                )(treeClient);

                store.setValue("");
                onSelect();
              }}
            >
              <VariableTypeIcon type={item.data.type} />
              {item.name}
            </Combobox.Item>
          );
        }}
      />
    </>
  );
}
