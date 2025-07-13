import { useTranslations } from "@mioto/locale";
import { type ErrorPageProps, ErrorPagesLayout } from "../ErrorPagesLayout";
import { ErrorIcon } from "./ErrorIcon";
import { LowerRight } from "./LowerRight";
import { UpperLeft } from "./UpperLeft";

type Props = {
  reset: () => void;
  className?: string;
} & Partial<Pick<ErrorPageProps, "heading" | "content">>;

export function ErrorPage({ reset, content, heading, className }: Props) {
  const t = useTranslations();

  return (
    <ErrorPagesLayout
      heading={heading ?? t("app.error.title")}
      content={content}
      cardIcon={<ErrorIcon className="absolute top-0 left-0 max-w-full" />}
      lowerRight={<LowerRight className="absolute bottom-0 right-0" />}
      upperLeft={<UpperLeft className="absolute top-0 left-0" />}
      colorScheme="warning"
      onReset={reset}
      className={className}
    />
  );
}
