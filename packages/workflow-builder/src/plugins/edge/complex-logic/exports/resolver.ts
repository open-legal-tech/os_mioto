import {
  fromDate,
  getLocalTimeZone,
  parseDate,
  toCalendarDate,
} from "@internationalized/date";
import { Failure, FatalError } from "@mioto/errors";
import { fromUnixTime, isAfter, isBefore, isEqual } from "date-fns";
import { filter, isIncludedIn } from "remeda";
import { P, match } from "ts-pattern";
import type { EdgeResolver } from "../../../../interpreter/resolver";
import {
  type IBooleanVariable,
  type IDateVariable,
  type IMultiSelectVariable,
  type INumberVariable,
  type IRecordVariable,
  type ISelectVariable,
  RecordVariable,
  type Variable,
} from "../../../../variables/exports/types";
import type { BooleanCondition } from "../conditions/Boolean";
import type { DateCondition } from "../conditions/Date";
import type { MultiSelectCondition } from "../conditions/MultiSelect";
import type { NumberCondition } from "../conditions/Number";
import type { SelectCondition } from "../conditions/Select";
import { evaluateText } from "../conditions/Text";
import type { Chain, IComplexLogicEdge } from "./plugin";

const checkSelectCondition = (
  variable: ISelectVariable,
  condition: SelectCondition,
) => {
  if (condition.operator === "defined" && variable.value != null) return true;
  if (condition.operator === "undefined" && variable.value == null) return true;

  // From this point we expect a value to be set
  if (!variable?.value) return false;
  if (
    condition.operator === "=" &&
    condition.comparator?.includes(variable.value)
  )
    return true;

  if (
    condition.operator === "!=" &&
    !condition.comparator?.includes(variable.value)
  )
    return true;

  return false;
};

const checkDateCondition = (
  variable: IDateVariable,
  condition: DateCondition,
) => {
  // From this point we expect a value to be set
  if (!variable?.value || !condition.comparator) return false;

  const localTimeZone = getLocalTimeZone();
  const dateComparator = parseDate(condition.comparator);
  const dateValue = toCalendarDate(
    fromDate(fromUnixTime(variable.value as any), localTimeZone),
  );

  switch (true) {
    case condition.operator === "before":
      return isBefore(
        dateValue.toDate(localTimeZone),
        dateComparator.toDate(localTimeZone),
      );

    case condition.operator === "after":
      return isAfter(
        dateValue.toDate(localTimeZone),
        dateComparator.toDate(localTimeZone),
      );

    case condition.operator === "at":
      return isEqual(
        dateValue.toDate(localTimeZone),
        dateComparator.toDate(localTimeZone),
      );

    default:
      return false;
  }
};

const checkNumberCondition = (
  variable: INumberVariable,
  condition: NumberCondition,
) => {
  if (!condition.operator) return false;

  if (condition.operator === "defined" && variable.value != null) return true;
  if (condition.operator === "undefined" && variable.value == null) return true;

  // If we reach this point we expect a comparator to be necessary.
  // We need to check against null, because we want 0 to be accepted as a valid value.
  if (variable.value == null || condition.comparator == null) return false;

  if (
    condition.operator === "=" &&
    Number(variable.value) === condition.comparator
  )
    return true;

  if (
    condition.operator === "!=" &&
    Number(variable.value) !== condition.comparator
  )
    return true;

  if (
    condition.operator === ">" &&
    Number(variable.value) > condition.comparator
  )
    return true;

  if (
    condition.operator === "<" &&
    Number(variable.value) < condition.comparator
  )
    return true;

  if (
    condition.operator === ">=" &&
    Number(variable.value) >= condition.comparator
  )
    return true;

  if (
    condition.operator === "<=" &&
    Number(variable.value) <= condition.comparator
  )
    return true;

  return false;
};

const checkMultiSelectCondition = (
  variable: IMultiSelectVariable,
  condition: MultiSelectCondition,
) => {
  if (condition.operator === "defined" && variable.value.length > 0)
    return true;
  if (condition.operator === "undefined" && variable.value.length === 0)
    return true;

  // From this point we expect a value to be set
  if (!variable?.value) return false;
  if (
    condition.operator === "=" &&
    condition.comparator &&
    filter(variable.value, isIncludedIn(condition.comparator)).length > 0
  )
    return true;

  if (
    condition.operator === "!=" &&
    condition.comparator &&
    !(filter(variable.value, isIncludedIn(condition.comparator)).length > 0)
  )
    return true;

  return false;
};

const evaluateSingleSelect =
  (condition: SelectCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: ISelectVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (checkSelectCondition(variable, condition)) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

const evaluateDate =
  (condition: DateCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: IDateVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (checkDateCondition(variable, condition)) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

const evaluateMultiSingleSelect =
  (condition: MultiSelectCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: IMultiSelectVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (checkMultiSelectCondition(variable, condition)) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

const evaluateNumber =
  (condition: NumberCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: INumberVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (checkNumberCondition(variable, condition)) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

const evaluateBoolean =
  (condition: BooleanCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: IBooleanVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (variable.value === (condition.operator === "true")) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

const evaluateRecord =
  (condition: BooleanCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable?: IRecordVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (variable && condition.operator === "true") {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };

export const complexLogicEdgeResolver: EdgeResolver<
  IComplexLogicEdge,
  Variable
> =
  ({ edge }) =>
  ({ variables, node }) => {
    console.group(`Bedingungen von ${node.name}`);
    const conditions = edge.conditions;
    let nextConditionIndex = undefined;

    for (const [index, conditionChain] of conditions.entries()) {
      if (nextConditionIndex && index < nextConditionIndex) {
        console.log(
          `Überspringe Bedingung ${
            index + 1
          }, da eine vorherige und Bedingung falsch war und eine weitere oder Bedingung gefunden wurde.`,
        );
        continue;
      }
      nextConditionIndex = undefined;

      const condition = conditionChain[0];
      const chain = conditionChain[1];
      if (condition.type === "placeholder") {
        console.log("Überspringe leere Platzhalter Bedingung.");
        continue;
      }

      const variable = Object.values(variables).find((v) => {
        return (
          v.id ===
          RecordVariable.splitVariableId(condition.variablePath).recordId
        );
      });
      const { childId } = RecordVariable.splitVariableId(
        condition.variablePath,
      );

      const result = match([variable, condition])
        .with([P.nullish, P.any], () => (({
        state: "failure"
      }) as const))
        .with(
          [{ type: "select" }, { type: "select" }],
          ([variable, condition]) =>
            evaluateSingleSelect(condition, chain, edge)(variable),
        )
        .with(
          [{ type: "number" }, { type: "number" }],
          ([variable, condition]) =>
            evaluateNumber(condition, chain, edge)(variable),
        )
        .with(
          [
            { type: "record" },
            { variablePath: P.when(() => !childId), type: "boolean" },
          ],
          ([variable, condition]) => {
            return evaluateRecord(condition, chain, edge)(variable);
          },
        )
        .with(
          [{ type: "record" }, { type: P.any }],
          ([variable, condition]) => {
            if (!(condition.variablePath.length > 1)) {
              throw new FatalError({
                code: "missing_childId_for_record_variable",
              });
            }

            const variableValue = RecordVariable.getValue(
              variable,
              condition.variablePath,
            );

            return match([variableValue, condition])
              .with(
                [{ type: "select" }, { type: "select" }],
                ([variable, condition]) => {
                  console.log(`Werte Einfachauswahlbedingung ${index + 1} aus`);
                  return evaluateSingleSelect(condition, chain, edge)(variable);
                },
              )
              .with(
                [{ type: "multi-select" }, { type: "multi-select" }],
                ([variable, condition]) => {
                  console.log(
                    `Werte Mehrfachauswahlbedingung ${index + 1} aus`,
                  );
                  return evaluateMultiSingleSelect(
                    condition,
                    chain,
                    edge,
                  )(variable);
                },
              )
              .with(
                [{ type: "number" }, { type: "number" }],
                ([variable, condition]) => {
                  console.log(`Werte Nummerbedingung ${index + 1} aus`);
                  return evaluateNumber(condition, chain, edge)(variable);
                },
              )
              .with(
                [{ type: "text" }, { type: "text" }],
                ([variable, condition]) => {
                  return evaluateText(condition, chain, edge)(variable);
                },
              )
              .with(
                [{ type: "boolean" }, { type: "boolean" }],
                ([variable, condition]) =>
                  evaluateBoolean(condition, chain, edge)(variable),
              )
              .with(
                [{ type: "date" }, { type: "date" }],
                ([variable, condition]) =>
                  evaluateDate(condition, chain, edge)(variable),
              )
              .otherwise(([variableValue, condition]) => {
                return {
                  state: "error",
                  failure: new Failure({
                    code: "invalid_variable_condition_combination",

                    debugMessage: `A condition of type ${condition.type} and variable of type ${variableValue?.type} have been encountered on ${node.name}. This should not be possible to configure.`,
                  }).body(),
                } as const;
              });
          },
        )
        .otherwise(
          ([variable]) =>
            (({
              state: "error",

              failure: new Failure({
                code: "invalid_variable_condition_combination",
                debugMessage: variable
                  ? `A variable of type ${variable.type} has been encountered in the resolver. All variables need to be records.`
                  : `No variable found.`,
              }).body()
            }) as const),
        );

      if (result.state === "failure") {
        console.log(`Ergebnis Bedingung ${index + 1}: Falsch`);
        if (chain === "or") {
          console.log(
            `Setze Auswertung fort, da Bedingung ${
              index + 1
            } von einer 'oder' Verknüpfung gefolgt wird.`,
          );
          continue;
        }

        const remainingOrIndex = conditions
          .slice(index)
          .findIndex(([_, chain]) => chain === "or");

        if (remainingOrIndex > 0) {
          console.log(
            `Setze Auswertung fort, da in den folgendenen Bedingungen eine 'oder' Verknüpfung an Stelle ${
              remainingOrIndex + index + 2
            } gefunden wurde.`,
          );
          nextConditionIndex = remainingOrIndex + index + 1;
          continue;
        }
      }

      if (result.state === "next") {
        console.log(`Ergebnis Bedingung ${index + 1}: Wahr`);
        console.log(
          `Setze Auswertung fort, da Bedingung ${
            index + 1
          } von einer 'und' Verknüpfung gefolgt wird.`,
        );
        continue;
      }

      if (result.state === "success") {
        console.log(`Ergebnis Bedingung ${index + 1}: Wahr`);
      }

      console.log("Auswertung Ende");
      console.groupEnd();
      return result;
    }

    console.log(`Ergebnis: Falsch`);
    console.log("Es wurden keine Bedingungen gefunden.");
    console.groupEnd();
    return { state: "failure" };
  };
