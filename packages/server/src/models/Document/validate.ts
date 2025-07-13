import type z from "zod";

import * as legacyDocGen from "./legacyDocGen";
import { getFileContent, getFileContentInput } from "../File/getContent";
import type { DB } from "../../db/types";

export const validateDocument = (db: DB) => async (input: TInput) => {
  const docTemplate = await getFileContent(db)(input);

  if (!docTemplate) throw new Error("Document not found after upload.");

  // if (globalEnv.FEATURE_DOC_GEN_V2) {
  //   console.log("Using doc gen v2");
  //   return docGenV2.validate(docTemplate.content);
  // }

  return legacyDocGen.validate(docTemplate.content);
};

export const validateDocumentInput = getFileContentInput;

export type TInput = z.infer<typeof validateDocumentInput>;
