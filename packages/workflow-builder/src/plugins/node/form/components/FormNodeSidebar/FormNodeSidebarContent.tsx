import { Form } from "@mioto/design-system/Form";
import Heading from "@mioto/design-system/Heading";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { Stack } from "@mioto/design-system/Stack";
import { useLocale, useTranslations } from "@mioto/locale";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { RichTextEditor } from "../../../../../rich-text-editor/exports/RichText/RichTextEditor";
import { useTree, useTreeClient } from "../../../../../tree/sync/state";
import { FormNode } from "../../exports/plugin";
import { InputPlugin } from "./InputPlugin";

export function FormNodeSidebarContent() {
  const nodeId = NodeSidebar.useSidebarContext();
  const locale = useLocale();
  const t = useTranslations();
  const { treeClient } = useTreeClient();
  const node = useTree(FormNode.getSingle(nodeId));

  const methods = Form.useForm({
    defaultValues: {
      rendererButtonLabel: node.rendererButtonLabel,
    },
  });

  return (
    <NodeSidebar.Tab value="content">
      <Stack className="gap-6 p-4">
        <section>
          <RichTextEditor
            data-test="richTextEditor"
            yContent={node.yContent}
            Label={(props) => (
              <Label
                className={headingClasses({
                  size: "tiny",
                  className: "mb-2",
                })}
                {...props}
              >
                {t(
                  "packages.node-editor.nodeEditingSidebar.richTextEditor.label",
                )}
              </Label>
            )}
            maxHeight={400}
          />
        </section>
        <section>
          <Heading level={3} size="tiny" className="mb-2">
            {t("plugins.node.form.renderer-configuration.label")}
          </Heading>
          <Form.Provider methods={methods}>
            <Form.Root>
              <Form.Field
                Label={t(
                  "plugins.node.form.renderer-configuration.button-label.label",
                )}
              >
                <Form.Input
                  {...methods.register("rendererButtonLabel", {
                    onChange: (event) =>
                      FormNode.updateRendererButtonLabel(
                        nodeId,
                        event.target.value,
                      )(treeClient),
                  })}
                />
              </Form.Field>
            </Form.Root>
          </Form.Provider>
        </section>
        {node.inputs ? (
          <InputPlugin inputs={node.inputs} nodeId={node.id} />
        ) : null}
      </Stack>
    </NodeSidebar.Tab>
  );
}
