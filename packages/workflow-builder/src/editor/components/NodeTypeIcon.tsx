import Badge from "@mioto/design-system/Badge";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import type React from "react";
import { assertNodeType } from "../../tree/createTreeClientWithPlugins";
import { nodeGroupColorSchemes } from "../../tree/type/plugin/NodePlugin";
import { variableIcons } from "../../variables/VariableIcons";
import { editorIcons } from "../editorIcons";
import { useTreeClient } from "../exports/state";

export type TypeIconProps = {
  className?: string;
  children: React.ReactNode;
  label: string;
};

export function TypeIcon({ children, className, label }: TypeIconProps) {
  return (
    <Badge
      square
      className={twMerge("p-1 text-colorScheme9", className)}
      tooltip={{ children: label }}
    >
      {children}
    </Badge>
  );
}

type NodeTypeIconProps = {
  type: string;
} & Omit<TypeIconProps, "children" | "label">;

export const NodeTypeIcon = ({
  type,
  className,
  ...props
}: NodeTypeIconProps) => {
  const t = useTranslations();
  const { nodePlugins } = useTreeClient();

  assertNodeType(type);

  const Icon = editorIcons[type];

  return (
    <TypeIcon
      label={t(`common.nodeNames.${type}.short` as any)}
      className={twMerge(
        nodeGroupColorSchemes[nodePlugins[type].blockGroup],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon /> : null}
    </TypeIcon>
  );
};

type VariableTypeIconProps = {
  type: keyof typeof variableIcons;
} & Omit<TypeIconProps, "children" | "label">;

export const VariableTypeIcon = ({
  type,
  className,
  ...props
}: VariableTypeIconProps) => {
  const t = useTranslations();
  const VariableIcon = variableIcons[type];

  return (
    <TypeIcon
      label={t(`common.variableNames.${type}`)}
      className={twMerge("colorScheme-gray", className)}
      {...props}
    >
      {VariableIcon}
    </TypeIcon>
  );
};
