"use client";;
import {
  Check,
  Info,
  Lightning,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import type { Required } from "utility-types";
import Badge from "../Badge";
import { Heading } from "../Heading/Heading";
import type { TNotification } from "../Notification/Notification";
import { Row } from "../Row/index";
import { Stack } from "../Stack/index";
import { Text } from "../Text/Text";
import { twMerge } from "../tailwind/merge";

import type { JSX } from "react";

const containerClasses = "rounded bg-white border border-gray5";

const icons = {
  danger: Warning,
  info: Info,
  success: Check,
  warning: Lightning,
} as const;

const variantColorSchemeClassName = {
  danger: "colorScheme-danger",
  info: "colorScheme-info",
  success: "colorScheme-success",
  warning: "colorScheme-warning",
};

export type InfoBoxProps = {
  CloseButton?: React.ReactNode;
  className?: string;
  layout?: "row" | "stack";
} & Required<
  Omit<TNotification, "duration" | "actions" | "key" | "type" | "id">,
  "variant"
> & {
    Actions?: () => JSX.Element | null;
  } & Pick<React.HTMLAttributes<HTMLDivElement>, "role">;

export function InfoBox({
  Content,
  Title,
  variant,
  CloseButton,
  className,
  Actions,
  explanation,
  customIcon,
  role,
  layout = "row",
}: InfoBoxProps) {
  const IconSVG = customIcon ? customIcon : icons[variant];

  if (layout === "stack") {
    return (
      <div
        role={role}
        className={twMerge(
          containerClasses,
          variantColorSchemeClassName[variant],
          className,
        )}
        aria-labelledby="info-box-title"
      >
        <Stack className="p-5 gap-5">
          <Row className="flex-1 gap-2 items-center" id="info-box-title">
            <Badge square colorScheme="inherit">
              <IconSVG />
            </Badge>
            {typeof Title === "string" ? (
              <Heading size="extra-small">{Title}</Heading>
            ) : (
              Title
            )}
            {CloseButton}
          </Row>
          <Stack className="flex-1 gap-2 overflow-x-hidden">
            {Content ? (
              typeof Content === "string" ? (
                <Text>{Content}</Text>
              ) : (
                <Content />
              )
            ) : null}
          </Stack>
        </Stack>
        {explanation || Actions ? (
          <Stack className="bg-gray2 p-4 gap-2">
            {explanation?.()}
            {Actions ? (
              <Row className="gap-2 justify-end">
                <Actions />
              </Row>
            ) : null}
          </Stack>
        ) : null}
      </div>
    );
  }

  return (
    <div
      role={role}
      className={twMerge(
        containerClasses,
        variantColorSchemeClassName[variant],
        className,
      )}
      aria-labelledby="info-box-title"
    >
      <Row className="p-5 gap-5 items-center">
        <Badge square colorScheme="inherit">
          <IconSVG />
        </Badge>
        <Stack className="flex-1 gap-2 overflow-x-hidden">
          <Row
            className="flex-1 justify-between gap-2 items-center"
            id="info-box-title"
          >
            {typeof Title === "string" ? (
              <Heading size="extra-small">{Title}</Heading>
            ) : (
              Title
            )}
            {CloseButton}
          </Row>
          {Content ? (
            typeof Content === "string" ? (
              <Text>{Content}</Text>
            ) : (
              <Content />
            )
          ) : null}
        </Stack>
      </Row>
      {explanation || Actions ? (
        <Stack className="bg-gray2 p-4 gap-2">
          {explanation?.()}
          {Actions ? (
            <Row className="gap-2 justify-end">
              <Actions />
            </Row>
          ) : null}
        </Stack>
      ) : null}
    </div>
  );
}
