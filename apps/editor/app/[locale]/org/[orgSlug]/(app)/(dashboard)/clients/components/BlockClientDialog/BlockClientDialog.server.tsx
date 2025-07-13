import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { notFound } from "next/navigation";
import { BlockClientDialogClient } from "./BlockClientDialog.client";

export async function BlockClientDialogServer({
  clientUuid,
}: {
  clientUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  // This gets all trees that have a version and are therefore
  // shareable to a customer
  const customer = await db.customer.findUnique({
    where: { userUuid: clientUuid },
    select: {
      fullName: true,
      userUuid: true,
      User: {
        select: {
          isBlocked: true,
          Account: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!customer) notFound();

  return (
    <BlockClientDialogClient
      customerName={
        customer.fullName ?? customer.User.Account?.email ?? "Fehlender Name"
      }
      isBlocked={customer.User.isBlocked}
      customerUuid={customer.userUuid}
    />
  );
}
