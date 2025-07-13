import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { z } from "zod";
import serverModelsEnv from "../../../env";

export const checkRegisterAccessInput = z.object({
  accessCode: z.string(),
});

export const checkRegisterAccess = async (input: TRegisterAccessInput) => {
  if (serverModelsEnv.REGISTER_ACCESS_CODES?.includes(input.accessCode))
    return { canRegister: true };

  return { canRegister: false } as const;
};

export type TRegisterAccessInput = z.infer<typeof checkRegisterAccessInput>;

export type TRegisterAccessFailures = ExtractFailures<
  typeof checkRegisterAccess
>;

export type TRegisterAccessData = ExcludeFailures<typeof checkRegisterAccess>;

export type TRegisterAccessOutput = Awaited<
  ReturnType<typeof checkRegisterAccess>
>;
