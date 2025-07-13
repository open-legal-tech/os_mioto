import { baseInputClasses, textInputClasses } from "@mioto/design-system/Input";
import { Popover } from "@mioto/design-system/Popover";
import Text from "@mioto/design-system/Text";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export type ReadableConditionPopoverProps = {
  Comparator?: React.ReactNode;
  Operator?: React.ReactNode;
  children?: React.ReactNode;
  variableName?: React.ReactNode;
  className?: string;
  recordVariableName?: string;
  withComparator?: boolean;
  isMissing?: boolean;
  onReset: () => void;
};

export const ReadableConditionPopover = ({
  variableName,
  children,
  Comparator,
  Operator,
  className,
  recordVariableName,
  isMissing,
  onReset,
}: ReadableConditionPopoverProps) => {
  const t = useTranslations();

  return (
    <>
      <Popover.Trigger asChild>
        <button
          type="button"
          id="readable-condition"
          className={twMerge([
            baseInputClasses(),
            textInputClasses({ size: "medium" }),
            "justify-between",
            variableName && ("bg-white" as string),
            className,
          ])}
          onClick={() => (isMissing ? onReset() : undefined)}
        >
          {!variableName && !recordVariableName ? (
            <span className="text-gray8">
              {t(
                "packages.node-editor.logic-configurator.condition.readable-input.empty",
              )}
            </span>
          ) : isMissing ? (
            <span className="text-danger8">
              {t(
                "packages.node-editor.logic-configurator.condition.readable-input.disabled",
              )}
            </span>
          ) : (
            <Text className="break-all">
              {variableName
                ? t.rich(
                    "packages.node-editor.logic-configurator.condition.readable-input.readable-condition.with-variable-name",
                    {
                      "variable-name": () => variableName,
                      recordVariableName,
                      operator: () => Operator,
                      comparator: () => Comparator,
                    },
                  )
                : t.rich(
                    "packages.node-editor.logic-configurator.condition.readable-input.readable-condition.without-variable-name",
                    {
                      recordVariableName,
                      operator: () => Operator,
                      comparator: () => Comparator,
                    },
                  )}
            </Text>
          )}
          <CaretDown />
        </button>
      </Popover.Trigger>
      <Popover.Content
        className="w-[--radix-popper-anchor-width] p-3"
        sideOffset={5}
      >
        {children}
      </Popover.Content>
    </>
  );
};
