import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label, { labelClasses } from "@mioto/design-system/Label";
import { rowClasses } from "@mioto/design-system/Row";
import { menuItemClasses } from "@mioto/design-system/classes/menuClasses";
import { overlayClasses } from "@mioto/design-system/classes/overlayClasses";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";
import {
  Button,
  ListBox,
  ListBoxItem,
  Popover,
  Label as ReactAriaLabel,
  Select,
  SelectValue,
} from "react-aria-components";
import { RichDateEditor } from "../../../../../rich-text-editor/exports/RichDate/RichDateEditor";
import type { TNodeId } from "../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { CalculationNode } from "../../plugin";

export function DateDifferenceSidebar({ nodeId }: { nodeId: TNodeId }) {
  const node = useTree(CalculationNode.getSingle(nodeId));
  const t = useTranslations();

  if (node.calculationType !== "date-difference")
    throw new Error(
      `Rendered date-difference component for ${node.calculationType} calculation type.`,
    );

  return (
    <>
      <RichDateEditor
        data-test="richTextEditor"
        yContent={node.yLaterDateFormular}
        Label={(props) => (
          <Label
            className={headingClasses({
              size: "tiny",
              className: "mb-2",
            })}
            {...props}
          >
            {t("components.rich-text-editor.date-difference.later-date.label")}
          </Label>
        )}
      />
      <DifferenceTypeSelector nodeId={nodeId} className="self-center" />
      <RichDateEditor
        data-test="richTextEditor"
        yContent={node.yEarlierDateFormular}
        Label={(props) => (
          <Label
            className={headingClasses({
              size: "tiny",
              className: "mb-2",
            })}
            {...props}
          >
            {t(
              "components.rich-text-editor.date-difference.earlier-date.label",
            )}
          </Label>
        )}
      />
    </>
  );
}

const itemClasses = twMerge(`${menuItemClasses} mx-0`);

function DifferenceTypeSelector({
  nodeId,
  className,
}: {
  nodeId: TNodeId;
  className?: string;
}) {
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const node = useTree(CalculationNode.getSingle(nodeId));

  if (node.calculationType !== "date-difference")
    throw new Error(
      `Rendered date-difference component for ${node.calculationType} calculation type.`,
    );

  return (
    <Select
      selectedKey={node.differenceIn}
      onSelectionChange={(value) => {
        CalculationNode.updateDifferenceIn(nodeId, value as any)(treeClient);
      }}
      className={className}
    >
      <ReactAriaLabel className={labelClasses({ emphasize: "weak" })}>
        {t(
          "components.rich-text-editor.date-difference.difference-selector.label",
        )}
      </ReactAriaLabel>{" "}
      <Button
        className={rowClasses(
          {},
          "items-center inline-flex focus-visible:outer-focus rounded",
        )}
      >
        <SelectValue />
        <CaretDown aria-hidden="true" />
      </Button>
      <Popover className={overlayClasses}>
        <ListBox className="flex flex-col gap-1">
          <ListBoxItem className={itemClasses} id="days">
            {t(
              "components.rich-text-editor.date-difference.difference-selector.days",
            )}
          </ListBoxItem>
          <ListBoxItem className={itemClasses} id="business-days">
            {t(
              "components.rich-text-editor.date-difference.difference-selector.business-days",
            )}
          </ListBoxItem>
          <ListBoxItem className={itemClasses} id="weeks">
            {t(
              "components.rich-text-editor.date-difference.difference-selector.weeks",
            )}
          </ListBoxItem>
          <ListBoxItem className={itemClasses} id="months">
            {t(
              "components.rich-text-editor.date-difference.difference-selector.months",
            )}
          </ListBoxItem>
          <ListBoxItem className={itemClasses} id="years">
            {t(
              "components.rich-text-editor.date-difference.difference-selector.years",
            )}
          </ListBoxItem>
        </ListBox>
      </Popover>
    </Select>
  );
}
