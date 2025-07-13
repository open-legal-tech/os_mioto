import { z } from "zod";
import { EmployeeInput } from "../../../utils/zodHelpers";

export const fileUploadTokenPayloadSchema = EmployeeInput.extend({
  updateTemplateUuid: z.string().optional(),
  treeUuid: z.string(),
});

export type TFileUploadTokenPayload = z.infer<
  typeof fileUploadTokenPayloadSchema
>;
