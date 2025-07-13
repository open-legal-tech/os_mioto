import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { Message } from "@mioto/design-system/Message";
import { useTranslations } from "@mioto/locale";
import React from "react";
import type { XmlFragment } from "yjs";
import { RichInput } from "../../../../../rich-text-editor/exports/RichInput/RichInput";

export function SubjectInput({ ySubject }: { ySubject: XmlFragment }) {
  const [error, setError] = React.useState<"too_short" | "too_long" | false>(
    false,
  );
  const minLength = 6;

  const t = useTranslations();

  const errors = {
    too_short: t("plugins.node.reporting.subject.errors.too_short", {
      minLength,
    }),
    too_long: t("plugins.node.reporting.subject.errors.too_long"),
  };

  return (
    <>
      <RichInput
        min={6}
        onValidation={(reason) =>
          reason === "valid" ? setError(false) : setError(reason)
        }
        yContent={ySubject}
        Label={(props) => (
          <Label
            className={headingClasses({
              size: "extra-small",
              className: "mb-2",
            })}
            {...props}
          >
            {t("plugins.node.reporting.subject.label")}
          </Label>
        )}
      />
      {error ? <Message size="small">{errors[error]}</Message> : null}
    </>
  );
}
