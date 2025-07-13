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
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";
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
import { SelectInputPlugin } from "../SelectInputPlugin";

const SelectInput = new SelectInputPlugin();

export const SelectInputPrimaryActionSlot: InputPrimaryActionSlot = ({
  inputId,
  nodeId,
}) => {
  const { treeClient } = useTreeClient();

  return (
    <AddOptionButton
      onClick={() => {
        const newAnswer = SelectInput.createAnswer({ value: "" });
        SelectInput.addAnswer(nodeId, inputId, newAnswer)(treeClient);
      }}
    />
  );
};

export const SelectInputConfigurator: InputConfigurator = ({
  inputId,
  withRequiredOption,
  nodeId,
}) => {
  const { treeClient } = useTreeClient();
  const ref = React.useRef<HTMLDivElement | null>(null);

  const input = useTree(FormNode.inputs.getType(nodeId, inputId, "select"));

  const yRendererLabel = FormNode.inputs.get(
    nodeId,
    inputId,
  )(treeClient).yRendererLabel;

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
        SelectInput.reorderAnswers(nodeId, input.id, newOrder)(treeClient);
      }}
    >
      <Form.Provider methods={methods}>
        <Form.Root className="gap-0">
          <InputConfig.Container>
            <InputConfig.LabelOption
              onNameChange={(newName) =>
                SelectInput.updateLabel(nodeId, inputId, newName)(treeClient)
              }
            />
            <InputConfig.RendererLabelOption
              onNoLabelChange={(newValue) =>
                SelectInput.updateNoRendererLabel(
                  nodeId,
                  inputId,
                  newValue,
                )(treeClient)
              }
              nodeId={nodeId}
              yRendererLabel={yRendererLabel}
            />
            {withRequiredOption ? (
              <InputConfig.RequiredOption
                onRequiredChange={(newValue) =>
                  SelectInput.updateRequired(
                    nodeId,
                    inputId,
                    newValue,
                  )(treeClient)
                }
              />
            ) : null}
            <Separator />
            <Stack>
              <Row className="justify-between mb-2">
                <Label>{t("plugins.node.form.select.answers.label")}</Label>
                <SelectInputPrimaryActionSlot
                  inputId={input.id}
                  nodeId={nodeId}
                />
              </Row>
              {input.answers.length > 0 ? (
                <Stack className="gap-2 pt-0">
                  {input.answers?.map((answer, index) => {
                    return (
                      <Answer
                        answer={answer}
                        inputId={inputId}
                        nodeId={nodeId}
                        groupRef={ref}
                        key={answer.id}
                        name={answer.id}
                        index={index}
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
  groupRef: React.MutableRefObject<HTMLDivElement | null>;
  name: string;
  index: number;
  nodeId: TNodeId;
};

const Answer = ({
  answer,
  inputId,
  groupRef,
  name,
  index,
  nodeId,
}: AnswerProps) => {
  const t = useTranslations();
  const { treeClient } = useTreeClient();

  const onChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const trimmedValue = event.target.value.trim();

      return SelectInput.updateAnswer(
        nodeId,
        inputId,
        answer.id,
        trimmedValue,
      )(treeClient);
    },
    [answer.id, inputId, nodeId, treeClient],
  );

  const onClick = React.useCallback(
    () => SelectInput.deleteAnswer(nodeId, inputId, answer.id)(treeClient),
    [answer.id, inputId, nodeId, treeClient],
  );

  const controls = useDragControls();
  const { register } = Form.useFormContext();

  return (
    <AnimatePresence initial={false}>
      <Reorder.Item
        key={answer.id}
        value={answer}
        dragListener={false}
        dragControls={controls}
        dragConstraints={groupRef}
        className="m-0"
      >
        <div className="grid gap-1 grid-cols-[1fr_max-content_max-content] items-center">
          <Form.Input
            key={answer.id}
            placeholder={t(
              "plugins.node.form.select.answers.input.placeholder",
            )}
            {...register(name, { onChange })}
            aria-label={t("plugins.node.form.select.answers.input.aria-label", {
              position: index + 1,
            })}
            className="bg-white"
          />
          <IconButton
            variant="tertiary"
            size="small"
            square
            colorScheme="gray"
            onPointerDown={(event) => controls.start(event)}
            tooltip={{
              children: t(
                "plugins.node.form.select.answers.reorder-handle.tooltip",
              ),
            }}
          >
            <DragHandle />
          </IconButton>
          <IconButton
            tooltip={{
              children: t("plugins.node.form.select.answers.remove.tooltip"),
            }}
            variant="tertiary"
            size="small"
            colorScheme="gray"
            square
            onClick={onClick}
          >
            <Trash />
          </IconButton>
        </div>
      </Reorder.Item>
    </AnimatePresence>
  );
};
