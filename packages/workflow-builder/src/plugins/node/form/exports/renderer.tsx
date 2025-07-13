"use client";

import { Form } from "@mioto/design-system/Form";
import {
  useRendererContext,
  useRendererMethods,
} from "../../../../renderer/Context";
import { RendererPrimitives } from "../../../../renderer/RendererPrimitives";
import type { TNodeRenderer } from "../../../../renderer/types";
import { RichTextRenderer } from "../../../../rich-text-editor/exports/RichText/RichTextRenderer";
import { useTreeClient } from "../../../../tree/sync/treeStore/TreeContext";
import {
  type IRecordVariable,
  RecordVariable,
} from "../../../../variables/exports/types";
import {
  type ExistingFileValues,
  formNodeSubmit,
} from "../components/formNodeSubmitAction";
import { formNodeInputPluginObjects } from "../components/inputPluginObjects";
import type { TInputId } from "../inputs/InputPlugin";
import type { TFormNodeInput } from "./inputPlugins";
import { FormNode, type IFormNode } from "./plugin";

export const FormNodeRenderer: TNodeRenderer = (props) => {
  const {
    config: { userUuid },
  } = useRendererContext();
  const { treeClient } = useTreeClient();
  const { getCurrentNode, getVariable, getVariables } = useRendererMethods();
  const node = getCurrentNode<IFormNode>();
  const variable = getVariable(node.id);
  const yContent = treeClient.nodes.get.yNode(node.id).get("yContent");
  const { send } = useRendererContext();

  const methods = Form.useForm<Record<TInputId, string | string[]>>({
    defaultValues: FormNode.createDefaultValues(
      node,
      Object.values(node.inputs),
      variable,
    ),
  });

  const {
    config: { sessionUuid, locale },
  } = useRendererContext();

  const onSubmit = methods.handleAsyncSubmit(async (values) => {
    const data = new FormData();

    const existingFileValues: ExistingFileValues = {};

    for (const key in values) {
      const value = values[key as any];
      if (value instanceof FileList) {
        const file = value[0];

        const existingFileValue = variable
          ? RecordVariable.getChildValue(
              variable as IRecordVariable,
              `${node.id}__${key as TInputId}`,
            )
          : undefined;

        if (existingFileValue?.type === "file" && existingFileValue.value) {
          existingFileValues[key] = existingFileValue.value;
        }

        if (file) data.append(key, file);
      }
    }

    let result = {};
    if (Array.from(data.keys()).length > 0) {
      result = await formNodeSubmit(
        { sessionUuid, existingFileValues, userUuid },
        data,
      );
    }

    const variables = FormNode.createVariable({
      nodeId: node.id,
      execution: "success",
      value: { ...values, ...result },
    })(treeClient);

    send({
      type: "EVALUATE",
      nodeId: node.id,
      variable: variables.variable,
      globalVariable: variables.globalVariable,
    });
  });

  return (
    <RendererPrimitives.Container
      canGoForward={!methods.formState.isDirty}
      isLoading={methods.formState.isSubmitting}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        <RichTextRenderer
          fragment={yContent}
        />
        {node.inputs ? (
          <FormNodeForm
            onSubmit={onSubmit}
            methods={methods}
            inputs={node.inputs}
            node={node}
          />
        ) : null}
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};

type FormNodeFormProps = {
  node: IFormNode;
  inputs: TFormNodeInput[];
  methods: Form.UseFormReturn;
  onSubmit: Form.RootProps<any>["onSubmit"];
};

const FormNodeForm = ({
  methods,
  inputs,
  node,
  onSubmit,
}: FormNodeFormProps) => {
  return (
    <RendererPrimitives.Form methods={methods} onSubmit={onSubmit}>
      {Object.values(inputs ?? {}).map((input) => {
        const FormElement =
          formNodeInputPluginObjects[input.type].RendererComponent;

        if (!FormElement) return null;

        return (
          <FormElement key={input.id} inputId={input.id} nodeId={node.id} />
        );
      })}
    </RendererPrimitives.Form>
  );
};
