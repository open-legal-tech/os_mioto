import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { notFound } from "next/navigation";
import { DeleteClientDialogClient } from "./DeleteClientDialog.client";

export async function DeleteClientDialogServer({
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
    <DeleteClientDialogClient
      customerName={
        customer.fullName ?? customer.User.Account?.email ?? "Fehlender Name"
      }
      customerUuid={customer.userUuid}
    />
  );
}
