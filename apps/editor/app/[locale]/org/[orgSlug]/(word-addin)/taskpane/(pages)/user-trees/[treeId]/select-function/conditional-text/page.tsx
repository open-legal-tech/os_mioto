"use client";

import { Button } from "@mioto/design-system/Button";
import { Popover } from "@mioto/design-system/Popover";
import { Stack } from "@mioto/design-system/Stack";
import { store, useAddInStore } from "../../../../../store";
// import {
//   useTreeClient,
//   useEditorVariables,
// } from "@mioto/workflow-builder/editor/state";
// import { TNodeId } from "@mioto/workflow-builder/tree/types";
// import { RecordVariable } from "@mioto/workflow-builder/variables/types";

export default function ConditionalTextPage() {
  // const { nodePlugins } = useTreeClient();
  // const variables = useEditorVariables(nodePlugins);
  // const selectVariables = useVariables(nodePlugins, {
  //   includeEmptyRecords: false,
  //   filterPrimitives: (variable): variable is ISelectVariable =>
  //     variable.type === "select",
  // });

  const { conditions } = useAddInStore();
  // console.log(selectVariables);

  // const nodeNames = useTree((treeClient) =>
  //   Object.values(treeClient.nodes.get.options(nodeId, "Ohne Name")),
  // );

  const handleCreateConditionClick = () => {
    store.conditions.push({ id: Date.now().toString(), type: "placeholder" });
  };

  console.log({ store });

  return (
    <Stack className="gap-y-4">
      <Button onClick={handleCreateConditionClick}>Create Condition</Button>
      {/* <CreateConditionButton
        options={Object.values(variables)}
        nodePlugins={nodePlugins}
        nodeId={nodeId}
      /> */}
      {conditions.map((condition, _idx) => (
        <Popover.Root key={condition.id}>
          {/* <Condition
            onReset={() => null}
            nodeId={condition.id as TNodeId}
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

              // store.condition = ComplexLogicEdge.conditions[
              //   childVariable.type
              // ].create([id, childId]);
            }}
            onSelectOperatorSelect={console.log}
            onNumberOperatorSelect={console.log}
            onSelectConditionChange={console.log}
            onNumberConditionChange={console.log}
            onBooleanOperatorSelect={console.log}
            onMultiSelectConditionChange={console.log}
            onMultiSelectOperatorSelect={console.log}
            onTextConditionChange={console.log}
            onTextOperatorSelect={console.log}
            onDateConditionChange={console.log}
            onDateOperatorSelect={console.log}
          /> */}
        </Popover.Root>
      ))}
    </Stack>
  );
}
