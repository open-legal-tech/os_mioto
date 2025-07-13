import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { useTranslations } from "@mioto/locale";
import { RichDateEditor } from "../../../../../rich-text-editor/exports/RichDate/RichDateEditor";
import type { TNodeId } from "../../../../../tree/id";
import {
  getNodeContentFromYDoc,
  useTree,
  useTreeContext,
} from "../../../../../tree/sync/state";
import { CalculationNode } from "../../plugin";

export function DateCalulationSidebar({ nodeId }: { nodeId: TNodeId }) {
  const node = useTree(CalculationNode.getSingle(nodeId));
  const t = useTranslations();

  const { treeMap } = useTreeContext();
  const yDateFormular = getNodeContentFromYDoc(
    treeMap,
    nodeId,
    "yDateFormular",
  );

  if (node.calculationType !== "date")
    throw new Error(
      `Rendered date component for ${node.calculationType} calculation type.`,
    );

  return (
    <RichDateEditor
      yContent={yDateFormular}
      Label={(props) => (
        <Label
          className={headingClasses({ size: "tiny", className: "mb-2" })}
          {...props}
        >
          {t("packages.node-editor.nodeEditingSidebar.richNumberEditor.label")}
        </Label>
      )}
    />
  );
}
