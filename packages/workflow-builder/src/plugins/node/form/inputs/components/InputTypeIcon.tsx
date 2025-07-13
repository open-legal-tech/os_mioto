import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import {
  TypeIcon,
  type TypeIconProps,
} from "../../../../../editor/components/NodeTypeIcon";
import { formNodeInputPluginObjects } from "../../components/inputPluginObjects";
import type { TFormInputTypes } from "../../exports/inputPlugins";

type InputTypeIconProps = {
  type: TFormInputTypes;
} & Omit<TypeIconProps, "children" | "label">;

export const InputTypeIcon = ({
  type,
  className,
  ...props
}: InputTypeIconProps) => {
  const t = useTranslations();
  const InputIcon = formNodeInputPluginObjects[type].Icon;

  return (
    <TypeIcon
      label={`${t(`common.variableNames.${type}` as any)}`}
      className={twMerge("colorScheme-gray", className)}
      {...props}
    >
      <InputIcon />
    </TypeIcon>
  );
};
