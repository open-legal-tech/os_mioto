import { useTranslations } from "@mioto/locale";
import type * as React from "react";
import { ErrorPagesLayout } from "../ErrorPagesLayout";
import { Icon404 } from "./404";
import { LowerRight } from "./LowerRight";
import { UpperLeft } from "./UpperLeft";

type Props = {
  heading?: React.ReactNode;
  content?: React.ReactNode;
  withBackbutton?: boolean;
  withSupport?: boolean;
};

export function NotFound({
  heading,
  content,
  withBackbutton,
  withSupport,
}: Props) {
  const t = useTranslations();

  return (
    <ErrorPagesLayout
      heading={heading ?? t("not-found.info.title")}
      content={content}
      cardIcon={<Icon404 className="absolute top-0 left-0 max-w-full" />}
      lowerRight={<LowerRight className="absolute bottom-0 right-0" />}
      upperLeft={<UpperLeft className="absolute top-0 left-0" />}
      withBackbutton={withBackbutton}
      withSupport={withSupport}
    />
  );
}
