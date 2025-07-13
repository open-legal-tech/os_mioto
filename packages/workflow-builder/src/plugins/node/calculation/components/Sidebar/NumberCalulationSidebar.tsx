import { headingClasses } from "@mioto/design-system/Heading/classes";
import Input from "@mioto/design-system/Input";
import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { Switch } from "@mioto/design-system/Switch";
import { useLocale, useTranslations } from "@mioto/locale";
import { RichNumberEditor } from "../../../../../rich-text-editor/exports/RichNumber/RichNumberEditor";
import type { TNodeId } from "../../../../../tree/id";
import {
  getNodeContentFromYDoc,
  useTree,
  useTreeClient,
  useTreeContext,
} from "../../../../../tree/sync/state";
import { CalculationNode } from "../../plugin";
import { GlobalVariableConnector } from "./GlobalVariableConnector";

export function NumberCalculationSidebar({ nodeId }: { nodeId: TNodeId }) {
  const locale = useLocale();
  const { treeClient } = useTreeClient();
  const node = useTree(CalculationNode.getSingle(nodeId));
  const t = useTranslations();

  const { treeMap } = useTreeContext();
  const yContent = getNodeContentFromYDoc(treeMap, nodeId, "yFormular");

  if (node.calculationType !== "number")
    throw new Error(
      `Rendered number component for ${node.calculationType} calculation type.`,
    );

  return (
    <>
      <RichNumberEditor
        data-test="richTextEditor"
        yContent={yContent}
        Label={(props) => (
          <Label
            className={headingClasses({
              size: "tiny",
              className: "mb-2",
            })}
            {...props}
          >
            {t(
              "packages.node-editor.nodeEditingSidebar.richNumberEditor.label",
            )}
          </Label>
        )}
      />
      <Stack className="gap-2">
        <Row className="justify-between items-center">
          <Label className="font-weak">
            {t("plugins.node.calculation.round-to.label")}
          </Label>
          <Switch.Root
            checked={node.roundTo != null}
            onCheckedChange={(checked) => {
              if (!checked) {
                return CalculationNode.disableRound(nodeId)(treeClient);
              }

              CalculationNode.updateRound(nodeId, 2)(treeClient);
            }}
          >
            <Switch.Thumb />
          </Switch.Root>
        </Row>
        {node.roundTo != null ? (
          <Input
            type="number"
            placeholder="2"
            value={node.roundTo}
            min={1}
            onChange={(event) => {
              const value = Number.isNaN(event.target.valueAsNumber)
                ? 1
                : (event.target.valueAsNumber ?? 1);

              CalculationNode.updateRound(nodeId, value)(treeClient);
            }}
          />
        ) : null}
      </Stack>
      <GlobalVariableConnector nodeId={nodeId} />
    </>
  );
}
