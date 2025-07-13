"use client";

import { Form } from "@mioto/design-system/Form";
import { useLocale } from "@mioto/locale";
import {
  useRendererContext,
  useRendererMethods,
} from "../../../../renderer/Context";
import { RendererPrimitives } from "../../../../renderer/RendererPrimitives";
import type { TNodeRenderer } from "../../../../renderer/types";
import { getRichTextVariables } from "../../../../renderer/utils/getRichTextVariables";
import { RichTextRenderer } from "../../../../rich-text-editor/exports/RichText/RichTextRenderer";
import { useTreeClient } from "../../../../tree/sync/treeStore/TreeContext";
import { InfoNode } from "./plugin";

export const InfoNodeRenderer: TNodeRenderer = ({ nodeId, ...props }) => {
  const locale = useLocale();
  const methods = Form.useForm({});
  const { send } = useRendererContext();
  const { treeClient } = useTreeClient();
  const { getVariables } = useRendererMethods();

  const fragment = treeClient.nodes.get.yNode(nodeId).get("yContent");

  const onSubmit = methods.handleSubmit((values) => {
    const variables = InfoNode.createVariable({
      nodeId: nodeId,
      execution: "success",
      value: values ?? {},
    })(treeClient);

    send({
      type: "EVALUATE",
      nodeId: nodeId,
      variable: variables.variable,
      globalVariable: variables.globalVariable,
    });
  });

  return (
    <RendererPrimitives.Container
      canGoForward={!methods.formState.isDirty}
      {...props}
    >
      <RendererPrimitives.ContentArea>
        <RichTextRenderer
          fragment={fragment}
        />
        <RendererPrimitives.Form methods={methods} onSubmit={onSubmit} />
      </RendererPrimitives.ContentArea>
    </RendererPrimitives.Container>
  );
};
