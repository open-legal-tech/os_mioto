import prisma from "@mioto/prisma";
import serverModelsEnv from "../../env";

if (
  serverModelsEnv.APP_ENV !== "development" &&
  serverModelsEnv.APP_ENV !== "testing"
) {
  throw new Error(
    "This prisma client should only be used in tests and development",
  );
}

export const testPrisma = prisma;
