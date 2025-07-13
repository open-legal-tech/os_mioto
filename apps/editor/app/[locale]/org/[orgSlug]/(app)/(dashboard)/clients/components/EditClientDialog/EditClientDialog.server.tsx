import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { notFound } from "next/navigation";
import { EditClientDialogClient } from "./EditClientDialog.client";

export async function EditClientDialogServer({
  clientUuid,
}: {
  clientUuid: string;
}) {
  const { db } = await getCurrentEmployee();

  // This gets all trees that have a version and are therefore
  // shareable to a customer
  const customer = await db.customer.findUnique({
    where: { userUuid: clientUuid },
    include: {
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
    <EditClientDialogClient
      firstname={customer.firstname ?? undefined}
      lastname={customer.lastname ?? undefined}
      email={customer.User.Account?.email ?? undefined}
      referenceNumber={customer.referenceNumber ?? undefined}
      company={customer.company ?? undefined}
      customerUuid={customer.userUuid}
      portalAccess={customer.hasPortalAccess}
    />
  );
}
