import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row } from "@mioto/design-system/Row";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { sortBy } from "remeda";
import {
  type TFormInputTypes,
  formNodeInputPlugins,
} from "../../exports/inputPlugins";
import { InputTypeIcon } from "./InputTypeIcon";

export type InputDropdownProps = {
  onSelect: (type: TFormInputTypes) => void;
  currentType?: string;
  align?: DropdownMenu.ContentProps["align"];
} & Omit<DropdownMenu.ButtonProps, "onSelect">;

export function InputDropdown({
  onSelect,
  className,
  alignByContent,
  size,
  colorScheme = "gray",
  round,
  emphasize,
  square,
  align,
  ...props
}: InputDropdownProps) {
  const t = useTranslations();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Button
        variant="tertiary"
        className={className}
        alignByContent={alignByContent}
        size={size}
        emphasize={emphasize}
        square={square}
        round={round}
        colorScheme={colorScheme}
        aria-label={t("plugins.node.form.inputs.new.aria-label")}
        {...props}
      >
        <Plus />
        {t("plugins.node.form.inputs.new.label")}
      </DropdownMenu.Button>
      <DropdownMenu.Content align={align}>
        <InputTypeDropdownContent onSelect={onSelect} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

type InputTypeDropdownProps = Pick<InputDropdownProps, "onSelect">;

export const InputTypeDropdownContent = ({
  onSelect,
}: InputTypeDropdownProps) => {
  const t = useTranslations();
  const relevantInputTypes = Object.keys(
    formNodeInputPlugins,
  ) as TFormInputTypes[];

  return sortBy(relevantInputTypes, (inputType) =>
    t(`plugins.node.form.${inputType}.name` as any),
  ).map((type) => {
    return (
      <DropdownMenu.Item
        key={type}
        onSelect={() => {
          onSelect(type);
        }}
        Icon={<InputTypeIcon type={type} className="p-1 colorScheme-gray" />}
      >
        <Row className="gap-2 items-center">
          {t(`plugins.node.form.${type}.name` as any)}
          <HelpTooltip>
            {t(`plugins.node.form.${type}.description` as any)}
          </HelpTooltip>
        </Row>
      </DropdownMenu.Item>
    );
  });
};
