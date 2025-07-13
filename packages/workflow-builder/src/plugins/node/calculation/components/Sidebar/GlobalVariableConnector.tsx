import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { isDefined, pickBy } from "remeda";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { GlobalVariablesNode } from "../../../global-variables/plugin";
import { isGlobalVariableId } from "../../../global-variables/type";
import { CalculationNode } from "../../plugin";

export function GlobalVariableConnector({ nodeId }: { nodeId: TNodeId }) {
  const node = useTree(CalculationNode.getSingle(nodeId));

  const options = useTree((treeClient) =>
    pickBy(
      GlobalVariablesNode.has(GlobalVariablesNode.id)(treeClient)
        ? GlobalVariablesNode.getSingle(GlobalVariablesNode.id)(treeClient)
            .variables
        : {},
      (variable) => variable.type === "number",
    ),
  );

  const { treeClient } = useTreeClient();
  const t = useTranslations();

  return (
    <Stack className="mt-2">
      <Label className={headingClasses({ size: "tiny", className: "mb-2" })}>
        {t("plugins.node.calculation.global-variable-connector.label")}
      </Label>
      <SelectWithCombobox
        value={node.globalVariableReference}
        options={Object.values(options)
          .filter(isDefined)
          .map((option) => ({
            id: option.id,
            type: "option",
            data: { type: option.type },
            name: option.name,
          }))}
        onSelect={(value) => {
          if (!isGlobalVariableId(value))
            throw new Error(
              "The selected id needs to be a global variable id. Review the options provided to the combobox.",
            );

          CalculationNode.updateGlobalVariableReference(
            nodeId,
            value,
          )(treeClient);
        }}
      />
    </Stack>
  );
}
