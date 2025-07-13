"use server";

import { DateFormatter } from "@internationalized/date";
import { Failure } from "@mioto/errors";
import { createFile } from "@mioto/server/File/create";
import { uploadFile } from "@mioto/server/File/upload";
import { generateDocumentAction } from "@mioto/server/actions/generateDocument.action";
import { checkAuthWithAnonymus as checkAuthWithAnonymusFallback } from "@mioto/server/db/checkAuthenticated";
import { PDFEngines } from "chromiumly";
import { fromUnixTime } from "date-fns";
import { fromEntries } from "remeda";
import { match } from "ts-pattern";
import type { InterpreterActionParams } from "../../../interpreter/exports/interpreterConfig";
import {
  type GroupVariable,
  type PrimitiveVariable,
  type Variable,
  isPrimitiveVariable,
} from "../../../variables/exports/types";
import { DocumentNode } from "./plugin";

const restructureVariables = (
  variables: Record<string, GroupVariable>,
  locale: string,
) => {
  const restructureVariable = (variable: Variable): any =>
    match(variable)
      .with({ type: "file" }, () => undefined)
      .with({ type: "record" }, (variable) =>
        fromEntries(
          Object.values(variable.value).map((variable) => [
            variable.escapedName,
            restructureVariable(variable),
          ]),
        ),
      )
      .with({ type: "date" }, (variable) => {
        const formatter = new DateFormatter(locale);
        return variable.value
          ? formatter.format(fromUnixTime(variable.value))
          : undefined;
      })
      .when(isPrimitiveVariable, (variable) => variable.readableValue)
      .otherwise(() => undefined);

  return fromEntries(
    Object.values(variables).map((variable) => {
      return [variable.escapedName, restructureVariable(variable)];
    }),
  );
};

export const documentNodev2Action = async ({
  nodeId,
  session,
  treeClient,
  getVariables,
  treeUuid,
  userUuid,
  locale,
}: InterpreterActionParams) => {
  const { user, db } = await checkAuthWithAnonymusFallback(userUuid);

  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "email" ||
      variable.type === "select" ||
      variable.type === "multi-select" ||
      variable.type === "boolean" ||
      variable.type === "date",
  });

  const node = DocumentNode.getSingle(nodeId)(treeClient);

  if (!node.templateUuid)
    return {
      type: "INVALID_EXECUTION",
      error: "missing_template_uuid",
    } as const;

  const documentBuffer = await generateDocumentAction({
    templateUuid: node.templateUuid,
    variables: restructureVariables(variables, locale),
    treeUuid,
    userUuid,
  });

  if (documentBuffer instanceof Failure)
    return {
      type: "INVALID_EXECUTION",
      error: documentBuffer.code,
    } as const;

  const documentData =
    node.outputAs === "pdf"
      ? {
          displayName: `${node.documentName}.pdf`,
          extension: "pdf",
          fileType: "application/pdf",
          user,
          fileData: await PDFEngines.convert({
            files: [documentBuffer],
          }),
        }
      : {
          displayName: `${node.documentName}.docx`,
          extension: "docx",
          fileType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          user,
          fileData: documentBuffer,
        };

  const file = await createFile(db)({
    ...documentData,
    orgUuid: user.organizationUuid,
  });

  await db.generatedFile.create({
    data: {
      sessionUuid: session.uuid,
      fileUuid: file.uuid,
    },
  });

  return {
    type: "EVALUATE",
    nodeId,
    variable: DocumentNode.createVariable({
      nodeId,
      execution: "success",
      value: {
        uuid: file.uuid,
        fileName: file.displayName,
      },
    })(treeClient).variable,
  } as const;
};
