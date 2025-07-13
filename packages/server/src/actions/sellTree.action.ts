"use server";

import { Failure } from "@mioto/errors";
import { z } from "zod";
import { getCurrentEmployee } from "../db/getCurrentEmployee";

const sellTreeActionInput = z.object({
  sellToUuid: z.string(),
  shareTreeUuid: z.string(),
  credits: z.union([z.nan(), z.number()]),
});

type SellTreeActionInput = z.infer<typeof sellTreeActionInput>;

export async function sellTreeAction(inputs: SellTreeActionInput) {
  const { credits, sellToUuid, shareTreeUuid } =
    sellTreeActionInput.parse(inputs);

  const { user, db, revalidatePath } = await getCurrentEmployee();

  const [customer, soldTree, tree] = await Promise.all([
    db.customer.findUnique({
      where: { userUuid: sellToUuid },
      include: {
        User: { select: { Organization: { select: { slug: true } } } },
      },
    }),
    db.soldTree.findUnique({
      where: {
        treeUuid_customerUserUuid: {
          customerUserUuid: sellToUuid,
          treeUuid: shareTreeUuid,
        },
      },
    }),
    db.tree.findUnique({
      where: {
        organizationUuid: user.organizationUuid,
        Employee: {
          some: {
            userUuid: user.uuid,
          },
        },
        uuid: shareTreeUuid,
      },
      include: {
        Snapshots: {
          select: {
            uuid: true,
          },
        },
      },
    }),
  ]);

  if (!customer || !tree)
    throw new Failure({
      code: "not_found",
      debugMessage: !customer ? "customer not found" : "tree not found",
    });

  if (soldTree) {
    await db.soldTree.update({
      where: {
        treeUuid_customerUserUuid: {
          customerUserUuid: soldTree.customerUserUuid,
          treeUuid: soldTree.treeUuid,
        },
      },
      data: {
        credits: Number.isNaN(credits) ? null : credits,
      },
    });
  } else {
    await db.soldTree.create({
      data: {
        credits,
        Tree: {
          connect: {
            uuid: shareTreeUuid,
          },
        },
        Customer: {
          connect: {
            userUuid: sellToUuid,
          },
        },
      },
    });
  }

  revalidatePath(`/client`);
  revalidatePath(`/clients`);

  return { success: true } as const;
}
