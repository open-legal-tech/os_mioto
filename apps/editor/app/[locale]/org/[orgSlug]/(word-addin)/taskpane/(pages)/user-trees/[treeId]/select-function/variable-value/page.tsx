"use client";

import { Button } from "@mioto/design-system/Button";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useEditorVariables } from "@mioto/workflow-builder/editor/state";
import type { ITextVariable } from "@mioto/workflow-builder/variables/types";
import { DevControls } from "../../../../../components";
import { insertTextVariable } from "../../../../../store";

export default function VariableValuePage() {
  const textVariables = useEditorVariables({
    includeEmptyRecords: false,
    filterPrimitives: (variable): variable is ITextVariable =>
      variable.type === "text",
  });

  return (
    <Stack className="gap-y-4">
      <DevControls />
      {Object.values(textVariables).map((parent) => (
        <Stack className="bg-cyan-100 rounded-lg p-2 gap-y-2" key={parent.id}>
          <Text>Type: {parent.type}</Text>
          <Text>Name: {parent.name}</Text>
          {typeof parent.value === "object" &&
            Object.values(parent.value).map((childNode) => (
              <Button
                key={childNode.id}
                onClick={() =>
                  Word.run(async (context) => {
                    await insertTextVariable(context, childNode);
                  })
                }
              >
                {childNode.name}
              </Button>
            ))}
        </Stack>
      ))}
    </Stack>
  );
}
