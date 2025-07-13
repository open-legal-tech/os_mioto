import type { Failure } from "@mioto/errors";
import { useTranslations } from "@mioto/locale";
import { Button } from "../Button/Button";
import { Heading } from "../Heading/Heading";
import { InfoBox } from "../InfoBox/InfoBox";
import { Text } from "../Text/Text";
import { twMerge } from "../tailwind/merge";

export type ErrorCardProps = {
  failure: Failure;
  className?: string;
  onReset?: () => void;
};

const baseClasses = "shadow5 border border-gray4";

export function ErrorCard({ className, onReset }: ErrorCardProps) {
  const t = useTranslations();

  return (
    <InfoBox
      Title={
        <Heading size="small" className="mb-2">
          {t("components.error-card.title")}
        </Heading>
      }
      Content={() => (
        <>
          <Text size="large" className="mb-4">
            {t("components.error-card.description")} <br />
            {t("components.error-card.assurance")}
          </Text>
          {onReset ? (
            <Button onClick={onReset} className="self-start">
              {t("components.error-card.callToAction")}
            </Button>
          ) : null}
        </>
      )}
      variant="danger"
      className={className ? twMerge(baseClasses, className) : baseClasses}
    />
  );
}
