"use server";

import { getCurrentUser } from "@mioto/server/db/getCurrentUser";

export async function getCustomerTrees({ orgSlug }: { orgSlug: string }) {
  const { user, db } = await getCurrentUser({
    orgSlug,
  });

  return user.type === "employee"
    ? (
        await db.tree.findMany({
          where: {
            Employee: {
              some: {
                userUuid: user.uuid,
              },
            },
            Snapshots: {
              some: {},
            },
          },
          include: {
            Snapshots: { take: 1, orderBy: { createdAt: "desc" } },
            Sessions: {
              where: {
                ownerUuid: user.uuid,
              },
              orderBy: {
                updatedAt: "desc",
              },
              select: {
                userLabel: true,
                uuid: true,
                name: true,
                updatedAt: true,
                status: true,
              },
            },
          },
        })
      ).map((tree) => ({
        ...tree,
        treeUuid: tree.uuid,
        credits: 1000,
      }))
    : (
        await db.soldTree.findMany({
          where: { customerUserUuid: user.uuid },
          include: {
            Tree: {
              select: {
                uuid: true,
                name: true,
                description: true,
                Snapshots: { take: 1, orderBy: { createdAt: "desc" } },
                Sessions: {
                  where: {
                    ownerUuid: user.uuid,
                  },
                  orderBy: {
                    updatedAt: "desc",
                  },
                  select: {
                    userLabel: true,
                    uuid: true,
                    name: true,
                    updatedAt: true,
                    status: true,
                  },
                },
              },
            },
          },
        })
      ).map((soldTree) => ({
        ...soldTree.Tree,
        treeUuid: soldTree.Tree.uuid,
        credits: soldTree.credits,
      }));
}
