"use server";

import type { DB } from "@mioto/server/db/types";
import type { Client } from "../components/ClientType";

export async function getClients({
  db,
  organizationUuid,
}: {
  db: DB;
  organizationUuid: string;
}): Promise<Client[]> {
  return (
    await db.customer.findMany({
      where: {
        User: {
          organizationUuid,
        },
      },
      include: {
        User: { include: { Account: { select: { email: true } } } },
      },
    })
  ).map((value) => ({
    uuid: value.User.uuid,
    email: value.User.Account?.email,
    referenceNumber: value.referenceNumber,
    createdAt: value.User.createdAt.toISOString(),
    updatedAt: value.User.updatedAt.toISOString(),
    name: value.fullName,
    status: value.User.isBlocked
      ? "BLOCKED"
      : value.hasPortalAccess
        ? value.User.status
        : "NO_ACCESS",
    isBlocked: value.User.isBlocked,
    hasPortalAccess: value.hasPortalAccess,
  }));
}
