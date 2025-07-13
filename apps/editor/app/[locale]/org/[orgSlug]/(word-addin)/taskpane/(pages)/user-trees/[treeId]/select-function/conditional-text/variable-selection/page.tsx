"use client";

import { Popover } from "@mioto/design-system/Popover";
import { Stack } from "@mioto/design-system/Stack";
// import {
//   ISelectVariable,
//   RecordVariable,
// } from "@mioto/workflow-builder/variables/types";
// import { TCondition } from "@mioto/workflow-builder/edge-plugin/complex-logic/type";
// import { useEditorVariables } from "@mioto/workflow-builder/editor/state";

// const _composeSelectComparator = (
//   variable: ISelectVariable,
//   // condition: SelectCondition,
// ) => {
//   // const comparatorStrings = variable.values
//   //   .filter((value) => condition.comparator?.includes(value.id))
//   //   .map(
//   //     (value, index, array) =>
//   //       `${value.value} ${index < array.length - 1 ? "oder" : ""}`,
//   //   );
//   // .join(" ");

//   // if (comparatorStrings.length === 0) return "ERROR";

//   // return comparatorStrings;

//   return;
// };

// const conditionInitial: TCondition = {
//   id: Date.now().toString(),
//   type: "placeholder",
//   variablePath: undefined,
// };

export default function ConditionalVariableSelectionPage() {
  // const variables = useEditorVariables({
  //   includeEmptyRecords: false,
  // });

  // const [condition, setCondition] = useState<TCondition>(conditionInitial);

  return (
    <Stack className="gap-y-4">
      <Popover.Root>
        {/* <Condition
          onReset={() => null}
          condition={condition}
          onVariableSelect={(id) => {
            const variable = variables[id];

            if (!variable) return;

            const childVariable = RecordVariable.getValue(variable, id);

            if (!childVariable) return;

            if (
              childVariable.type !== "select" &&
              childVariable.type !== "number"
            )
              return;

            setCondition(
              ComplexLogicEdge.conditions[childVariable.type].create(id),
            );
          }}
          onSelectOperatorSelect={(operator) => {
            setCondition((old) => ({ ...old, operator }) as any);
          }}
          onNumberOperatorSelect={(operator) => {
            setCondition((old) => ({ ...old, operator }) as TCondition);
          }}
          onSelectConditionChange={(selectedConditionId) => {
            setCondition(
              (old) =>
                ({
                  ...old,
                  comparator: selectedConditionId,
                }) as TCondition,
            );
          }}
          onNumberConditionChange={(value) => {
            setCondition(
              (old) =>
                ({
                  ...old,
                  comparator: value,
                }) as TCondition,
            );
          }}
          onBooleanOperatorSelect={console.log}
          onMultiSelectConditionChange={console.log}
          onMultiSelectOperatorSelect={console.log}
          onTextConditionChange={console.log}
          onTextOperatorSelect={console.log}
          onDateConditionChange={console.log}
          onDateOperatorSelect={console.log}
        /> */}
      </Popover.Root>
      <div className="self-end">
        {/* <Button
          disabled={
            condition.comparator == null ||
            (Array.isArray(condition.comparator) &&
              condition.comparator.length) === 0
          }
          onClick={() =>
            Word.run(async (context) => {
              if (condition.type === "select") {
                const variable = variables[condition.variablePath[0]];
                const childVariable = RecordVariable.getValue(
                  variable,
                  condition.variablePath[1],
                );
                const operator = condition.operator
                  ? numberOperators[condition.operator].label
                  : "ERROR";
                const comparator = composeSelectComparator(
                  childVariable as ISelectVariable,
                  condition,
                );

                await insertConditionVariable(
                  context,
                  condition,
                  formatReadableConditionString({
                    variableName: variable.name,
                    recordVariableName: childVariable.name,
                    Operator: operator,
                    Comparator: Array.isArray(comparator)
                      ? comparator.join(" ")
                      : comparator,
                  }),
                );

                setCondition(conditionInitial);
              }
            })
          }
        >
          Create Conditional Text
        </Button> */}
      </div>
    </Stack>
  );
}
