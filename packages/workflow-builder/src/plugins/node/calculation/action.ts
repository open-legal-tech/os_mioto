"use server";

import * as Sentry from "@sentry/nextjs";
import {
  differenceInBusinessDays,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInWeeks,
  differenceInYears,
  fromUnixTime,
  isBefore,
} from "date-fns";
import { match } from "ts-pattern";
import type { InterpreterActionParams } from "../../../interpreter/exports/interpreterConfig";
import { DateCalculator } from "../../../rich-text-editor/exports/RichDate/DateCalculator";
import { getText as getRichDateText } from "../../../rich-text-editor/exports/RichDate/transformers/text";
import { convertToRichTextJson as convertToRichDateJson } from "../../../rich-text-editor/exports/RichDate/transformers/yFragment";
import { NumberCalculator } from "../../../rich-text-editor/exports/RichNumber/NumberCalculator";
import { getText as getRichNumberText } from "../../../rich-text-editor/exports/RichNumber/transformers/text";
import { convertToRichTextJson as convertToRichNumberJson } from "../../../rich-text-editor/exports/RichNumber/transformers/yFragment";
import type { INumberVariable } from "../../../variables/exports/types";
import { CalculationNode } from "./plugin";

export const calculationNodeAction = async ({
  nodeId,
  getVariables,
  treeClient,
  locale,
}: InterpreterActionParams) => {
  const variables = getVariables({
    filterPrimitives: (variable): variable is INumberVariable =>
      variable.type === "number" || variable.type === "date",
  });

  const node = CalculationNode.getSingle(nodeId)(treeClient);
  const yNode = treeClient.nodes.get.yNode(nodeId);

  let result: number | "error" | Date | undefined = undefined;
  try {
    switch (node.calculationType) {
      case "number": {
        const json = convertToRichNumberJson(yNode.get("yFormular"));
        const formular = getRichNumberText({
          json,
          variables,
          locale: "unformatted",
        });

        if (!formular || formular?.length === 0) {
          return {
            type: "INVALID_EXECUTION",
            error: "missing_formular",
          } as const;
        }

        result = NumberCalculator.eval(formular, [], {});

        if (Number.isNaN(result)) {
          return {
            type: "INVALID_EXECUTION",
            error: "invalid_formular",
          } as const;
        }

        result = Number.parseFloat(result.toFixed(node.roundTo ?? 5));

        break;
      }

      case "date": {
        const json = convertToRichDateJson(yNode.get("yDateFormular"));
        const formular = getRichDateText({ json, variables, locale });

        if (!formular || formular?.length === 0) {
          return {
            type: "INVALID_EXECUTION",
            error: "missing_formular",
          } as const;
        }

        result = fromUnixTime(DateCalculator.eval(formular, [], {}));

        break;
      }

      case "date-difference": {
        const earlierJson = convertToRichDateJson(
          yNode.get("yEarlierDateFormular"),
        );
        const earlierFormular = getRichDateText({
          json: earlierJson,
          variables,
          locale: "unformatted",
        });

        if (!earlierFormular || earlierFormular?.length === 0) {
          return {
            type: "INVALID_EXECUTION",
            error: "missing_formular",
          } as const;
        }

        const laterJson = convertToRichDateJson(
          yNode.get("yLaterDateFormular"),
        );
        const laterFormular = getRichDateText({
          json: laterJson,
          variables,
          locale: "unformatted",
        });

        console.log({ earlierFormular, laterFormular });

        if (!laterFormular || laterFormular?.length === 0) {
          return {
            type: "INVALID_EXECUTION",
            error: "missing_formular",
          } as const;
        }

        const earlierDate = fromUnixTime(
          DateCalculator.eval(earlierFormular, [], {}),
        );
        const laterDate = fromUnixTime(
          DateCalculator.eval(laterFormular, [], {}),
        );

        console.log({ earlierDate, laterDate });

        if (!isBefore(earlierDate, laterDate)) {
          return {
            type: "INVALID_EXECUTION",
            error: "later_date_before_earlier_date",
          } as const;
        }

        result = match(node.differenceIn)
          .with("days", () => differenceInCalendarDays(laterDate, earlierDate))
          .with("business-days", () =>
            differenceInBusinessDays(laterDate, earlierDate),
          )
          .with("weeks", () => differenceInWeeks(laterDate, earlierDate))
          .with("months", () => differenceInMonths(laterDate, earlierDate))
          .with("years", () => differenceInYears(laterDate, earlierDate))
          .exhaustive();
        break;
      }

      default: {
        Sentry.withScope((scope) => {
          scope.addAttachment(node);
          Sentry.captureException(
            new Error("Unknown or missing calculation type"),
          );
        });
      }
    }
  } catch (e) {
    console.log(e);
    result = "error";
  }

  const { variable, globalVariable } = CalculationNode.createVariable({
    nodeId,
    execution: result === "error" ? "error" : "success",
    value: result === "error" ? undefined : result,
  })(treeClient);

  if (result === "error") {
    return {
      type: "INVALID_EXECUTION",
      error: "unknown_error",
    } as const;
  }

  return {
    type: "EVALUATE",
    nodeId,
    variable,
    globalVariable,
  } as const;
};
