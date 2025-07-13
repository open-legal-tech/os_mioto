import { sidebarCardBottomClasses } from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useLocale, useTranslations } from "@mioto/locale";
import * as React from "react";
import type { XmlFragment } from "yjs";
import { useEditorVariables } from "../../../../../editor/useEditorVariables";
import { RichInput } from "../../../../../rich-text-editor/exports/RichInput/RichInput";
import type { TNodeId } from "../../../../../tree/id";
import { useTreeClient } from "../../../../../tree/sync/state";
import type { TreeClient } from "../../../../../tree/type/treeClient";
import {
  type IMultiSelectVariable,
  type PrimitiveVariable,
  isFileVariable,
  isPrimitiveVariable,
} from "../../../../../variables/exports/types";
import type { InputPlugin, TInputId } from "../InputPlugin";
import type { InputConfiguratorProps } from "../types/componentTypes";

type ContainerProps = {
  children: React.ReactNode;
};

export const Container = ({ children }: ContainerProps) => {
  return (
    <Stack className={sidebarCardBottomClasses()}>
      <Stack className="gap-3 p-4">{children}</Stack>
    </Stack>
  );
};

type NameOptionProps = { onNameChange: (newName: string) => void };

export const LabelOption = ({ onNameChange }: NameOptionProps) => {
  const { register } = Form.useFormContext();
  const labelId = React.useId();
  const t = useTranslations();

  return (
    <Form.Field
      Label={
        <Row className="gap-2">
          {t("plugins.node.form.inputs.config.name.label")}
          <HelpTooltip>
            {t("plugins.node.form.inputs.config.name.help-tooltip.content")}
          </HelpTooltip>
        </Row>
      }
    >
      <Form.Input
        {...register("input-label", {
          onChange: (event) => {
            const trimmedValue = event.target.value.trim();
            onNameChange(trimmedValue);
          },
        })}
        id={labelId}
        className="bg-white"
        autoComplete="off"
      />
    </Form.Field>
  );
};

type LabelOptionProps = {
  onNoLabelChange: (newValue: boolean) => void;
  nodeId: TNodeId;
  yRendererLabel: XmlFragment;
};

export const RendererLabelOption = ({
  onNoLabelChange,
  nodeId,
  yRendererLabel,
}: LabelOptionProps) => {
  const locale = useLocale();
  const { register } = Form.useFormContext();
  const labelId = React.useId();

  const variables = useEditorVariables({
    excludeIds: [nodeId],
    filterPrimitives: (
      variable,
    ): variable is Exclude<PrimitiveVariable, IMultiSelectVariable> =>
      isPrimitiveVariable(variable) &&
      variable.type !== "multi-select" &&
      !isFileVariable(variable),
  });

  const t = useTranslations();

  return (
    <Form.Field
      Label={
        <Row className="gap-2">
          {t("plugins.node.form.inputs.config.renderer-label.label")}
          <HelpTooltip>
            {t(
              "plugins.node.form.inputs.config.renderer-label.help-tooltip.content",
            )}
          </HelpTooltip>
        </Row>
      }
      TopRight={(props) => (
        <Form.Field
          Label={t(
            "plugins.node.form.inputs.config.renderer-label.deactivate.label",
          )}
          layout="constrained-right"
          {...props}
        >
          <Form.Checkbox
            {...register("noLabel", {
              onChange: (event) => onNoLabelChange(event.target.checked),
            })}
          />
        </Form.Field>
      )}
    >
      <RichInput
        yContent={yRendererLabel}
        id={labelId}
        className="bg-white"
        autoComplete="off"
      />
    </Form.Field>
  );
};

type RequiredOptionProps = {
  className?: string;
  onRequiredChange: (newValue: boolean) => void;
};

export const RequiredOption = ({
  onRequiredChange,
  className,
}: RequiredOptionProps) => {
  const { register } = Form.useFormContext();
  const requiredCheckboxId = React.useId();
  const t = useTranslations();

  return (
    <Form.Field
      Label={t("plugins.node.form.inputs.config.required.label")}
      layout="constrained-right"
      className={className}
    >
      <Form.Checkbox
        {...register("required", {
          onChange: (event) => onRequiredChange(event.target.checked),
        })}
        id={requiredCheckboxId}
        value="required"
      />
    </Form.Field>
  );
};

type PlaceholderOptionProps = {
  className?: string;
  onPlaceholderOptionChange: (newValue: string) => void;
};

export const PlaceholderOption = ({
  onPlaceholderOptionChange,
  className,
}: PlaceholderOptionProps) => {
  const { register } = Form.useFormContext();
  const placeholderId = React.useId();
  const t = useTranslations();

  return (
    <Form.Field
      Label={t("plugins.node.form.inputs.config.placeholder.label")}
      className={className}
    >
      <Form.Input
        className="bg-white"
        {...register("placeholder", {
          onChange: (event) => onPlaceholderOptionChange(event.target.value),
        })}
        id={placeholderId}
        autoComplete="off"
      />
    </Form.Field>
  );
};

export const InputConfig = {
  Container,
  LabelOption,
  RendererLabelOption,
  RequiredOption,
  PlaceholderOption,
};

// This is the old way of having one config component for all input types. This has not scaled
// well so the content has been modularized and new configs can use those components to create
// custom config uis.
// ------------------------------------------------------------------

interface ExtendedInputPlugin extends InputPlugin {
  updateRequired?: (
    nodeId: TNodeId,
    inputId: TInputId,
    newValue: boolean,
  ) => (treeClient: TreeClient) => void;
}

type Props = InputConfiguratorProps & {
  inputId: TInputId;
  inputPlugin: ExtendedInputPlugin;
  nodeId: TNodeId;
  yRendererLabel: XmlFragment;
  children?: React.ReactNode;
};

export function DefaultInputConfig({
  inputPlugin,
  inputId,
  nodeId,
  yRendererLabel,
  children,
}: Props) {
  const { treeClient } = useTreeClient();

  return (
    <Container>
      <LabelOption
        onNameChange={(newName) =>
          inputPlugin.updateLabel(nodeId, inputId, newName)(treeClient)
        }
      />
      <RendererLabelOption
        onNoLabelChange={(newValue) =>
          inputPlugin.updateNoRendererLabel(
            nodeId,
            inputId,
            newValue,
          )(treeClient)
        }
        nodeId={nodeId}
        yRendererLabel={yRendererLabel}
      />
      {inputPlugin.updateRequired ? (
        <RequiredOption
          onRequiredChange={(newValue) =>
            inputPlugin.updateRequired?.(nodeId, inputId, newValue)(treeClient)
          }
        />
      ) : null}
      {children}
    </Container>
  );
}
