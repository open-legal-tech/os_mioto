"use client";

import {
  sidebarCardBottomClasses,
  sidebarCardClasses,
} from "@mioto/design-system/Card";
import { Form } from "@mioto/design-system/Form";
import { Heading } from "@mioto/design-system/Heading";
import { headingClasses } from "@mioto/design-system/Heading/classes";
import Label from "@mioto/design-system/Label";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import { match } from "ts-pattern";
import { useSidebarContext } from "../../../../../editor/components/NodeEditor/Canvas/Sidebar";
import { NodeSidebar } from "../../../../../editor/components/NodeSidebar";
import { RichTextEditor } from "../../../../../rich-text-editor/exports/RichText/RichTextEditor";
import {
  getNodeContentFromYDoc,
  useTree,
  useTreeClient,
  useTreeContext,
} from "../../../../../tree/sync/state";
import { ReportingNode } from "../../plugin";
import { EmailVariableSelector } from "./EmailVariableSelector";
import { FileSelector } from "./FileSelector";
import { SelectReceivingEmail } from "./SelectReceivingEmail";
import { SubjectInput } from "./SubjectInput";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const ReportingNodeSidebarContent = React.forwardRef<HTMLDivElement, {}>(
  (_, ref) => {
    const nodeId = useSidebarContext();
    const { treeMap } = useTreeContext();

    const yContent = getNodeContentFromYDoc(treeMap, nodeId, "yMailBody");
    const ySubject = getNodeContentFromYDoc(treeMap, nodeId, "ySubject");

    const { treeClient } = useTreeClient();

    const node = useTree(ReportingNode.getSingle(nodeId));

    const methods = Form.useForm({
      defaultValues: {
        recipient: (node as any)?.variant.recipientCustom ?? "",
        mailSubject: node.mailSubject,
        sendUserAnswers: node.sendUserAnswers,
      },
    });

    const id = React.useId();

    const t = useTranslations();

    return (
      <NodeSidebar.Tab value="content">
        <Stack className="gap-6 p-4" ref={ref}>
          <Form.Provider methods={methods}>
            <Form.Root onSubmit={(event) => event.preventDefault()}>
              <section>
                <SelectReceivingEmail nodeId={nodeId} />
                {match(node)
                  .with({ variant: { type: "default" } }, () => {
                    return <React.Fragment />;
                  })
                  .with({ variant: { type: "variable" } }, (node) => {
                    return (
                      <div style={{ marginTop: "10px" }}>
                        <EmailVariableSelector
                          nodeId={nodeId}
                          value={node.variant.recipientVariable}
                          id={id}
                        />
                      </div>
                    );
                  })
                  .with({ variant: { type: "custom" } }, () => {
                    return (
                      <div style={{ marginTop: "10px" }}>
                        <Form.Input
                          placeholder={t(
                            "plugins.node.reporting.recipient.placeholder",
                          )}
                          {...methods.register("recipient", {
                            onChange: (event) => {
                              const hasValue = event.target.value.length > 0;
                              ReportingNode.updateRecipient(
                                nodeId,
                                hasValue ? event.target.value : undefined,
                              )(treeClient);
                            },
                          })}
                        />
                      </div>
                    );
                  })
                  .otherwise(() => {
                    return <React.Fragment />;
                  })}
              </section>
              <section className={stackClasses({}, [sidebarCardClasses()])}>
                <Heading size="tiny" className="p-4">
                  {t("plugins.node.reporting.e-mail.title")}
                </Heading>
                <Stack className={sidebarCardBottomClasses("gap-3 p-4")}>
                  <SubjectInput ySubject={ySubject} />
                  <RichTextEditor
                    maxHeight={400}
                    data-test="richTextEditor"
                    yContent={yContent}
                    Label={(props) => (
                      <Label
                        className={headingClasses({
                          size: "tiny",
                          className: "mb-2",
                        })}
                        {...props}
                      >
                        {t("plugins.node.reporting.e-mail.label")}
                      </Label>
                    )}
                  />
                  <Form.Field
                    Label={t("plugins.node.reporting.path.label")}
                    layout="constrained-right"
                  >
                    <Form.Checkbox
                      {...methods.register("sendUserAnswers", {
                        onChange: (event) => {
                          ReportingNode.updateSendUserAnswers(
                            nodeId,
                            event.target.checked,
                          )(treeClient);
                        },
                      })}
                    />
                  </Form.Field>
                  <Form.Field
                    Label={t("plugins.node.reporting.attachement.label")}
                  >
                    <FileSelector nodeId={nodeId} id={id} maxSelection={2} />
                  </Form.Field>
                </Stack>
              </section>
            </Form.Root>
          </Form.Provider>
        </Stack>
      </NodeSidebar.Tab>
    );
  },
);
