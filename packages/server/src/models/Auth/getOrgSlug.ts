import { Failure } from "@mioto/errors";
import type { DB } from "../../db/types";

export const getOrgSlug = (db: DB) => async (organizationUuid: string) => {
  const org = await db.organization.findUnique({
    where: {
      uuid: organizationUuid,
    },
    select: {
      uuid: true,
      slug: true,
    },
  });

  if (!org)
    return new Failure({
      code: "user_org_not_found",
    });

  return {
    uuid: org.uuid,
    slug: org.slug,
  };
};
