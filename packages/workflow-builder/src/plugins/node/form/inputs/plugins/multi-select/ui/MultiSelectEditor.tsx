"use client";

import { DragHandle } from "@mioto/design-system/DragHandle";
import { Form } from "@mioto/design-system/Form";
import { IconButton } from "@mioto/design-system/IconButton";
import Label from "@mioto/design-system/Label";
import { Row } from "@mioto/design-system/Row";
import Separator from "@mioto/design-system/Separator";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { Reorder, useDragControls } from "framer-motion";
import * as React from "react";
import type { TNodeId } from "../../../../../../../tree/id";
import { useTree, useTreeClient } from "../../../../../../../tree/sync/state";
import { FormNode } from "../../../../exports/plugin";
import type { TInputId } from "../../../InputPlugin";
import { AddOptionButton } from "../../../components/AddOptionButton";
import { InputConfig } from "../../../components/InputConfig";
import type { TAnswer } from "../../../types/answer";
import type {
  InputConfigurator,
  InputPrimaryActionSlot,
} from "../../../types/componentTypes";
import { MultiSelectInputPlugin } from "../MultiSelectInputPlugin";

const MultiSelect = new MultiSelectInputPlugin();

export const MultiSelectInputConfigurator: InputConfigurator = ({
  inputId,
  withRequiredOption,
  nodeId,
}) => {
  const { treeClient } = useTreeClient();

  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree(
    FormNode.inputs.getType(nodeId, inputId, "multi-select"),
  );

  const yRendererLabel = FormNode.inputs
    .getYInput(
      nodeId,
      inputId,
    )(treeClient)
    .get("yRendererLabel");

  const methods = Form.useForm({
    defaultValues: {
      noLabel: input.noRendererLabel,
      "input-label": input.label,
      required: [input?.required ? "required" : ""],
      ...Object.fromEntries(
        input?.answers.map((answer) => [answer.id, answer.value]) ?? [],
      ),
    },
  });

  const t = useTranslations();

  return (
    <Reorder.Group
      className="list-none p-0 grid"
      ref={ref}
      axis="y"
      values={input.answers ?? []}
      onReorder={(newOrder) => {
        MultiSelect.reorderAnswers(nodeId, inputId, newOrder)(treeClient);
      }}
    >
      <Form.Provider methods={methods}>
        <Form.Root>
          <InputConfig.Container>
            <InputConfig.LabelOption
              onNameChange={(newName) =>
                MultiSelect.updateLabel(nodeId, inputId, newName)(treeClient)
              }
            />
            <InputConfig.RendererLabelOption
              nodeId={nodeId}
              yRendererLabel={yRendererLabel}
              onNoLabelChange={(newValue) =>
                MultiSelect.updateNoRendererLabel(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
            />
            {withRequiredOption ? (
              <InputConfig.RequiredOption
                onRequiredChange={(newValue) => {
                  MultiSelect.updateRequired(
                    nodeId,
                    inputId,
                    newValue,
                  )(treeClient);
                }}
              />
            ) : null}
            <Separator />
            <Stack>
              <Row className="justify-between mb-2">
                <Label>
                  {t("plugins.node.form.multi-select.answers.label")}
                </Label>
                <MultiSelectInputPrimaryActionSlot
                  inputId={inputId}
                  nodeId={nodeId}
                />
              </Row>
              {input.answers.length > 0 ? (
                <Stack className="pt-0 gap-2">
                  {input.answers.map((answer, index) => {
                    return (
                      <Answer
                        groupRef={ref}
                        answer={answer}
                        inputId={input.id}
                        nodeId={nodeId}
                        key={answer.id}
                        name={answer.id}
                        position={index + 1}
                      />
                    );
                  })}
                </Stack>
              ) : null}
            </Stack>
          </InputConfig.Container>
        </Form.Root>
      </Form.Provider>
    </Reorder.Group>
  );
};

type AnswerProps = {
  answer: TAnswer;
  inputId: TInputId;
  nodeId: TNodeId;
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
  position: number;
};

const Answer = ({
  answer,
  inputId,
  nodeId,
  groupRef,
  name,
  position,
}: AnswerProps) => {
  const { treeClient } = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = event.target.value.trim();

      MultiSelect.updateAnswer(
        nodeId,
        inputId,
        answer.id,
        trimmedValue,
      )(treeClient);
    },
    [answer.id, inputId, nodeId, treeClient],
  );

  const onClick = React.useCallback(() => {
    MultiSelect.deleteAnswer(nodeId, inputId, answer.id)(treeClient);
  }, [answer.id, inputId, nodeId, treeClient]);

  const controls = useDragControls();
  const { register } = Form.useFormContext();

  const t = useTranslations();

  return (
    <Reorder.Item
      key={answer.id}
      value={answer}
      dragListener={false}
      dragControls={controls}
      dragConstraints={groupRef}
      className="m-0"
    >
      <div className="grid gap-2 grid-cols-[1fr_max-content_max-content] items-center">
        <Form.Input
          key={answer.id}
          placeholder="Antwort"
          {...register(name, { onChange })}
          className="bg-white"
          aria-label={t(
            "plugins.node.form.multi-select.answers.input.aria-label",
            { position },
          )}
        />
        <IconButton
          variant="tertiary"
          type="button"
          square
          onPointerDown={(event) => controls.start(event)}
          tooltip={{
            children: t("plugins.node.form.multi-select.answers.reorder"),
          }}
        >
          <DragHandle />
        </IconButton>
        <IconButton
          variant="tertiary"
          type="button"
          square
          onClick={onClick}
          tooltip={{
            children: t("plugins.node.form.multi-select.answers.remove"),
          }}
        >
          <Trash />
        </IconButton>
      </div>
    </Reorder.Item>
  );
};

export const MultiSelectInputPrimaryActionSlot: InputPrimaryActionSlot = ({
  inputId,
  nodeId,
}) => {
  const { treeClient } = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = MultiSelect.createAnswer({});
        MultiSelect.addAnswer(nodeId, inputId, newAnswer)(treeClient);
      }}
    />
  );
};
