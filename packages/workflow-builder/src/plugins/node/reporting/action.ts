"use server";

import { FatalError } from "@mioto/errors";
import { sendEmail } from "@mioto/email/sendEmail";
import { getFileContent } from "@mioto/server/File/getContent";
import { checkAuthWithAnonymus } from "@mioto/server/db/checkAuthenticated";
import { dangerousFullAccessPrisma } from "@mioto/server/db/prisma";
import type { DB } from "@mioto/server/db/types";
import { isDefined, reverse } from "remeda";
import { match } from "ts-pattern";
import validator from "validator";
import { getTranslations } from "@mioto/locale/server";
import type { InterpreterActionParams } from "../../../interpreter/exports/interpreterConfig";
import { getText } from "../../../rich-text-editor/exports/RichInput/transformers/text";
import { generateHtml } from "../../../rich-text-editor/exports/RichText/transformers/html";
import { convertToRichTextJson } from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type { TRichText } from "../../../rich-text-editor/exports/types";
import {
  type IFileVariable,
  type IRecordVariable,
  RecordVariable,
  type Variable,
  isDefinedFileVariable,
  isFileVariable,
  isPrimitiveVariable,
} from "../../../variables/exports/types";
import { type IReportingNode, ReportingNode } from "./plugin";

const generateJSONContentFromVariables = (
  variable: Variable,
): TRichText | undefined =>
  match(variable)
    .with({ type: "record" }, (variable) => {
      const values = Object.values(variable.value);

      const content = values
        .map((value) => generateJSONContentFromVariables(value))
        .filter((value): value is NonNullable<TRichText> => value != null);

      return content.length > 0
        ? {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: variable.name }],
              },
              {
                type: "bulletList",
                content,
              },
            ],
          }
        : undefined;
    })
    .with({ type: "file" }, (variable) => {
      return {
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: variable.name,
              },
            ],
          },
        ],
      };
    })
    .when(isPrimitiveVariable, (variable) => {
      if (!variable.readableValue) return undefined;

      return {
        type: "listItem",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `${variable.name}: ${
                  typeof variable.readableValue === "string"
                    ? variable.readableValue
                    : Array.isArray(variable.readableValue)
                      ? variable.readableValue.join(", ")
                      : variable.readableValue
                }`,
              },
            ],
          },
        ],
      };
    })
    .otherwise(() => undefined);

const sendReport = async ({
  node,
  html,
  attachementVariables,
  subject,
  orgUuid,
  db,
  recipient,
}: {
  orgUuid: string;
  node: IReportingNode;
  html: string | null;
  attachementVariables: Record<string, IRecordVariable<IFileVariable>>;
  subject: string;
  db: DB;
  recipient: string;
}) => {
  const t = await getTranslations();
  const attachments = (
    await Promise.all(
      Object.values(attachementVariables)
        .flatMap((variable) => Object.values(variable.value))
        .map(async (variable) => {
          if (!isDefinedFileVariable(variable)) return undefined;

          return {
            file: await getFileContent(db)({
              fileUuid: variable.value.uuid,
              orgUuid,
            }),
            ...variable.value,
          };
        }),
    )
  )
    .filter(isDefined)
    .map((value) => {
      if (!value.file) return undefined;

      return {
        contentInBase64: Buffer.from(value.file.content).toString("base64"),
        name: `${value.fileName}.${value.file.extension}`,
        contentType: value.file.fileType,
      };
    })
    .filter(isDefined);

  const result = await sendEmail({
    email: recipient,
    subject: subject,
    message: html ?? t("plugins.node.reporting.no-content"),
    attachments: attachments.length > 0 ? attachments : undefined,
  });

  if (result instanceof Error) throw result;

  return { success: result.success, nodeId: node.id };
};

export const reportingNodeAction = async ({
  nodeId,
  treeClient,
  getVariables,
  session,
  userUuid,
  locale,
  getVariable,
}: InterpreterActionParams) => {
  const { db } = await checkAuthWithAnonymus(userUuid);
  const t = await getTranslations();

  const organisation = await db.organization.findFirst({
    where: {
      OR: [
        {
          Users: {
            some: {
              Sessions: {
                some: {
                  uuid: session.uuid,
                },
              },
            },
          },
        },
      ],
    },
    select: {
      slug: true,
      uuid: true,
    },
  });

  if (!organisation) throw new FatalError({ code: "no_organisation" });

  const node = ReportingNode.getSingle(nodeId)(treeClient);

  let recipient: string | undefined;
  switch (node.variant.type) {
    case "default":
      recipient = (
        await dangerousFullAccessPrisma.user.findFirst({
          where: {
            organizationUuid: organisation.uuid,
            role: "ADMIN",
          },
          select: {
            Account: {
              select: { email: true },
            },
          },
        })
      )?.Account?.email;
      break;
    case "variable":
      if (node.variant.recipientVariable) {
        const { recordId } = RecordVariable.splitVariableId(
          node.variant.recipientVariable,
        );
        const variable = getVariable(recordId);
        if (!variable)
          return {
            type: "INVALID_EXECUTION",
            error: "missing_recipient",
          } as const;

        const childVariable = RecordVariable.getChildValue(
          variable,
          node.variant.recipientVariable,
        );

        if (!childVariable || childVariable.type !== "email")
          return {
            type: "INVALID_EXECUTION",
            error: "invalid_recipient",
          } as const;

        recipient = childVariable.value;
      }
      break;
    case "custom":
      recipient = node.variant.recipientCustom;
      break;
  }

  if (!recipient) {
    return { type: "INVALID_EXECUTION", error: "missing_recipient" } as const;
  }

  if (validator.isEmail(recipient) === false) {
    return { type: "INVALID_EXECUTION", error: "invalid_recipient" } as const;
  }

  // I need a way to only get the child variables of the attachements.
  const attachementVariables = getVariables({
    filterPrimitives: isFileVariable,
    includeChildIds: node.attachements,
  });

  const primitiveVariables = getVariables({
    filterPrimitives: isPrimitiveVariable,
  });

  const fileVariables = getVariables({
    filterPrimitives: isFileVariable,
  });

  const yMailBody = treeClient.nodes.get.yNode(nodeId).get("yMailBody");
  const json = convertToRichTextJson(yMailBody);

  const history = session.state.history.nodes;
  const orderedVariables = reverse(history)
    .map(({ id }) => primitiveVariables[id])
    .filter(isDefined);

  const content = Object.values(orderedVariables)
    .map(generateJSONContentFromVariables)
    .filter(
      (value): value is { type: "listItem"; content: TRichText[] } =>
        value != null,
    );

  const html = generateHtml({
    json: {
      type: "doc",
      content: [
        ...(json?.content
          ? [...json.content, { type: "hardBreak" }, { type: "hardBreak" }]
          : []),
        ...(node.sendUserAnswers
          ? [
              {
                type: "heading",
                attrs: { level: 2 },
                content: [
                  {
                    type: "text",
                    text: t("plugins.node.reporting.decision-process"),
                  },
                ],
              },
              ...content,
            ]
          : []),
      ],
    },
    variables: primitiveVariables,
    fileVariables,
    locale,
  });

  const ySubject = treeClient.nodes.get.yNode(nodeId).get("ySubject");
  const subjectJson = convertToRichTextJson(ySubject);

  const subject = getText({
    json: subjectJson as any,
    variables: primitiveVariables,
    locale,
  });

  if (subject.length < 6) {
    return { type: "INVALID_EXECUTION", error: "missing_subject" } as const;
  }

  if (html.length < 10) {
    return { type: "INVALID_EXECUTION", error: "missing_content" } as const;
  }

  const result = await sendReport({
    attachementVariables,
    html,
    node,
    subject,
    orgUuid: organisation.uuid,
    db,
    recipient,
  });

  return {
    type: "EVALUATE",
    nodeId,
    variable: ReportingNode.createVariable({
      nodeId,
      execution: "success",
      value: result,
    })(treeClient).variable,
  } as const;
};
