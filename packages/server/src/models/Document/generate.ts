import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import z from "zod";
import * as legacyDocGen from "./legacyDocGen";
import { getFileContent, getFileContentInput } from "../File/getContent";
import type { DB } from "../../db/types";

export const generateDocument =
  (db: DB) =>
  async ({ fileUuid, variables, orgUuid }: TInput) => {
    const docTemplate = await getFileContent(db)({ fileUuid, orgUuid });

    if (!docTemplate)
      return new Failure({
        code: "missing_template",
      });

    // if (globalEnv.FEATURE_DOC_GEN_V2) {
    //   console.log("Using doc gen v2");
    //   return docGenV2.generate(variables, docTemplate.content);
    // }

    return legacyDocGen.generate(variables, docTemplate.content);
  };

export const generateDocumentInput = getFileContentInput.extend({
  variables: z.object({}).passthrough(),
});

export type TInput = z.infer<typeof generateDocumentInput>;
export type TFailures = ExtractFailures<typeof generateDocument>;

export type TData = ExcludeFailures<typeof generateDocument>;

export type TOutput = Awaited<ReturnType<typeof generateDocument>>;
