"use server";

import { Failure } from "@mioto/errors";
import { getCurrentUser } from "@mioto/server/db/getCurrentUser";
import { emptySession } from "@mioto/workflow-builder/constants";
import { redirect } from "../../../../../../../i18n/routing";
import { getLocale } from "next-intl/server";

export async function createCustomerSessionAction({
  snapshotUuid,
  treeUuid,
  name,
  orgSlug,
}: {
  snapshotUuid: string;
  treeUuid: string;
  name: string;
  orgSlug: string;
}) {
  const { user, db } = await getCurrentUser({ orgSlug });

  if (user.type === "employee") {
    const snapshot = await db.treeSnapshot.findUnique({
      where: {
        uuid: snapshotUuid,
      },
      select: {
        document: true,
        OriginTree: {
          select: {
            uuid: true,
          },
        },
      },
    });

    if (!snapshot || !snapshot.document)
      throw new Error("Snapshot of session not found.");

    const run = await db.session.create({
      data: {
        name,
        status: "IN_PROGRESS",
        treeSnapshotUuid: snapshotUuid,
        treeUuid: snapshot.OriginTree.uuid,
        ownerUuid: user.uuid,
        state: emptySession,
      },
    });

    return redirect({
      href: `/org/${user.Organization.slug}/client/render/${run.uuid}`,
      locale: await getLocale(),
    });
  }

  const [soldTree, snapshot, existingSessions] = await Promise.all([
    db.soldTree.findUnique({
      where: {
        treeUuid_customerUserUuid: {
          customerUserUuid: user.uuid,
          treeUuid,
        },
      },
      select: {
        credits: true,
      },
    }),
    db.treeSnapshot.findUnique({
      where: {
        uuid: snapshotUuid,
      },
      select: {
        document: true,
        OriginTree: {
          select: {
            uuid: true,
          },
        },
      },
    }),
    db.session.findMany({
      where: {
        ownerUuid: user.uuid,
        treeUuid: treeUuid,
      },
    }),
  ]);

  if (!snapshot || !snapshot.document)
    throw new Error("Snapshot of session not found.");

  if (!soldTree || (soldTree?.credits ?? 0) <= existingSessions.length) {
    return {
      success: false,
      failure: new Failure({
        code: "no_credits_left",
      }).body(),
    };
  }

  const run = await db.session.create({
    data: {
      name,
      status: "IN_PROGRESS",
      treeSnapshotUuid: snapshotUuid,
      treeUuid: snapshot.OriginTree.uuid,
      ownerUuid: user.uuid,
      state: emptySession,
    },
  });

  return redirect({
    href: `/org/${user.Organization.slug}/client/render/${run.uuid}`,
    locale: await getLocale(),
  });
}
