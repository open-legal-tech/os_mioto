import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { notFound } from "next/navigation";
import { ShareTreeDialogClient } from "./ShareTreeDialog.client";

export async function ShareTreeDialogServer({
  clientUuid,
}: {
  clientUuid: string;
}) {
  const { user, db } = await getCurrentEmployee();

  // This gets all trees that have a version and are therefore
  // shareable to a customer
  const [shareableTrees, customer] = await Promise.all([
    (
      await db.tree.findMany({
        where: {
          Snapshots: {
            some: {
              OriginTree: {
                Employee: {
                  some: {
                    userUuid: user.uuid,
                  },
                },
              },
            },
          },
          Employee: {
            some: {
              userUuid: user.uuid,
            },
          },
        },
        select: {
          Snapshots: {
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          uuid: true,
          name: true,
          SoldTrees: {
            where: {
              customerUserUuid: clientUuid,
            },
            select: {
              treeUuid: true,
              credits: true,
            },
          },
        },
      })
    ).map(({ name, uuid, SoldTrees }) => {
      return {
        name,
        id: uuid,
        credits:
          SoldTrees.find((soldTree) => soldTree.treeUuid === uuid)?.credits ??
          undefined,
      };
    }),
    await db.customer.findUnique({
      where: { userUuid: clientUuid },
      select: {
        fullName: true,
        userUuid: true,
        User: {
          select: {
            Account: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    }),
  ]);

  if (!customer) notFound();

  return (
    <ShareTreeDialogClient
      sellTo={{
        uuid: customer.userUuid,
        name: customer.fullName ?? customer.User.Account?.email,
      }}
      shareableTrees={shareableTrees}
    />
  );
}
