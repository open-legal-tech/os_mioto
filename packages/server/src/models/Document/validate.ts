import type z from "zod";

import * as legacyDocGen from "./legacyDocGen";
import { getFileContent, getFileContentInput } from "../File/getContent";
import type { DB } from "../../db/types";

export const validateDocument = (db: DB) => async (input: TInput) => {
  const docTemplate = await getFileContent(db)(input);

  const chunks: Buffer[] = [];
  const readable = docTemplate?.content.readableStreamBody;
  if (!readable) throw new Error("Document not found after upload.");

  for await (const chunk of readable) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const content = Buffer.concat(chunks);

  // if (globalEnv.FEATURE_DOC_GEN_V2) {
  //   console.log("Using doc gen v2");
  //   return docGenV2.validate(docTemplate.content);
  // }

  return legacyDocGen.validate(content);
};

export const validateDocumentInput = getFileContentInput;

export type TInput = z.infer<typeof validateDocumentInput>;
