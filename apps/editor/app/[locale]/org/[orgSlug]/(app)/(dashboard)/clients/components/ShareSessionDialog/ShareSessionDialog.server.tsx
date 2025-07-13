import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { emptySession } from "@mioto/workflow-builder/constants";
import { notFound } from "next/navigation";
import { ShareSessionDialogClient } from "./ShareSessionDialog.client";
import builderEnv from "../../../../../../../../../env";

export async function ShareSessionDialogServer({
  clientUuid,
  orgSlug,
}: {
  clientUuid: string;
  orgSlug: string;
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
          0,
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

  const shareSessionAction = async ({ treeUuid }: { treeUuid: string }) => {
    "use server";
    const { db } = await getCurrentEmployee();

    const tree = await db.tree.findUnique({
      where: {
        uuid: treeUuid,
      },
    });
    if (!tree) {
      throw new Error("Tree not found");
    }

    const session = await db.session.create({
      data: {
        name: `${new Date().toLocaleDateString()} ${tree.name}`,
        state: emptySession,
        status: "IN_PROGRESS",
        ownerUuid: clientUuid,
        treeUuid,
      },
    });

    return {
      success: true,
      link: `${builderEnv.CLIENT_ENDPOINT}/org/${orgSlug}/render/${treeUuid}/${session.uuid}`,
    } as const;
  };

  return (
    <ShareSessionDialogClient
      shareSessionAction={shareSessionAction}
      shareableTrees={shareableTrees}
    />
  );
}
