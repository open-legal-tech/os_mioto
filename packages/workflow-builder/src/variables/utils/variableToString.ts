import { DateFormatter } from "@internationalized/date";
import { NumberFormatter } from "@internationalized/number";
import { fromUnixTime } from "date-fns";
import { match } from "ts-pattern";
import { type Variable, isPrimitiveVariable } from "../exports/types";

export const variableToString = (
  variable: Variable,
  locale: string | "unformatted",
) =>
  variable
    ? match(variable)
        .with({ type: "date" }, (variable) => {
          if (!variable.value) return "";
          if (locale === "unformatted") return variable.value.toString();

          const formatter = new DateFormatter(locale);

          return formatter.format(fromUnixTime(variable.value));
        })
        .with({ type: "number" }, (variable) => {
          if (variable.readableValue === "NaN") return "";

          if (!variable.value) return "";

          if (locale === "unformatted") {
            return variable.value;
          }

          const formatter = new NumberFormatter(locale, {
            maximumFractionDigits: 20,
          });

          return formatter.format(Number(variable.value));
        })
        .when(
          isPrimitiveVariable,
          (variable) => variable.readableValue?.toString() ?? "",
        )
        .with({ type: "file" }, (variable) => variable.name)
        .otherwise(() => "")
    : "";
