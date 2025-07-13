import { Prisma } from "@mioto/prisma";
const { TokenType } = Prisma;
import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { addMinutes } from "date-fns";
import { z } from "zod";
import { EmployeeInput } from "../../../utils/zodHelpers";
import { createToken } from "../../create";
import { saveTokenToDb } from "../../save";
import type { TFileUploadTokenPayload } from "./shared";
import type { DB } from "../../../../db/types";
import serverModelsEnv from "../../../../../env";

export const createFileUploadToken =
  (db: DB) =>
  async ({ treeUuid, updateTemplateUuid, employee }: TInput) => {
    const expires = addMinutes(
      new Date(),
      serverModelsEnv.FILE_UPLOAD_EXPIRATION_MINUTES,
    );
    const uploadFileToken = await createToken({
      expiry: expires,
      type: TokenType.UPLOAD_FILE,
      secret: serverModelsEnv.ACCESS_TOKEN_SECRET,
      payload: (updateTemplateUuid
        ? { treeUuid, updateTemplateUuid, employee }
        : { treeUuid, employee }) satisfies TFileUploadTokenPayload,
    });

    await saveTokenToDb(db)({
      token: uploadFileToken,
      userUuid: employee.uuid,
      expiry: expires,
      type: TokenType.UPLOAD_FILE,
    });

    return uploadFileToken;
  };

export const createFileUploadTokenInput = EmployeeInput.extend({
  treeUuid: z.string(),
  updateTemplateUuid: z.string().optional(),
});

export type TInput = z.infer<typeof createFileUploadTokenInput>;

export type TFailures = ExtractFailures<typeof createFileUploadToken>;

export type TData = ExcludeFailures<typeof createFileUploadToken>;

export type TOutput = Awaited<ReturnType<typeof createFileUploadToken>>;
