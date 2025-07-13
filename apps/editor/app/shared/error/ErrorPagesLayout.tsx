import { ButtonLink } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import type { ColorKeys } from "@mioto/design-system/utils/types";
import { useTranslations } from "@mioto/locale";
import type * as React from "react";
import { ContactSupport } from "./ContactSupport";

export type ErrorPageProps = {
  heading: React.ReactNode;
  content?: React.ReactNode;
  upperLeft: React.ReactNode;
  lowerRight: React.ReactNode;
  cardIcon: React.ReactNode;
  colorScheme?: ColorKeys;
  onReset?: () => void;
  className?: string;
  withBackbutton?: boolean;
  withSupport?: boolean;
};

export function ErrorPagesLayout({
  heading,
  content,
  upperLeft,
  lowerRight,
  cardIcon,
  colorScheme = "primary",
  onReset,
  withBackbutton = true,
  className,
  withSupport = true,
}: ErrorPageProps) {
  const t = useTranslations();

  return (
    <Stack
      center
      className={`colorScheme-${colorScheme} h-full p-2 bg-colorScheme1 isolate ${className}`}
    >
      <div className="absolute top-0 left-0">{upperLeft}</div>
      <div className="max-w-[800px] border border-colorScheme5 rounded relative bg-white z-10">
        <Stack className="gap-7 p-8 z-10 relative">
          {typeof heading === "string" ? (
            <Heading size="large">{heading}</Heading>
          ) : (
            heading
          )}
          {typeof content === "string" ? (
            <Text size="large">{content}</Text>
          ) : (
            content
          )}
          <Row className="gap-4 justify-center">
            {withBackbutton && (
              <ButtonLink
                variant="secondary"
                colorScheme={colorScheme}
                href="/"
                onClick={onReset}
              >
                {t("error.backButton")}
              </ButtonLink>
            )}
            {withSupport && (
              <ContactSupport className="z-50" colorScheme={colorScheme} />
            )}
          </Row>
        </Stack>
        <div className="absolute top-0 left-0 max-w-full">{cardIcon}</div>
      </div>
      <div className="absolute bottom-0 right-0">{lowerRight}</div>
    </Stack>
  );
}
