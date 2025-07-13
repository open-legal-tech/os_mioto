import type { ExcludeFailures, ExtractFailures } from "@mioto/errors";
import { createAccessToken } from "../Token/subModels/AccessToken/create";
import { createRefreshToken } from "../Token/subModels/RefreshToken/create";
import type { DB } from "../../db/types";

export const generateAuthTokens =
  (db: DB) => async (userUuid: string, orgSlug: string) => {
    return {
      access: await createAccessToken({ userUuid, orgSlug }),
      refresh: await createRefreshToken(db)({
        orgSlug,
        userUuid,
      }),
    };
  };

export type TFailures = ExtractFailures<typeof generateAuthTokens>;

export type TData = ExcludeFailures<typeof generateAuthTokens>;

export type TOutput = Awaited<ReturnType<typeof generateAuthTokens>>;
