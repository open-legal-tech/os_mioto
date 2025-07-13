import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { fromEntries } from "remeda";
import { getClients } from "../shared/getClients";
import { ClientCard } from "./ClientCard";
import { ClientList } from "./ClientList";

export async function FullClientList({ orgSlug }: { orgSlug: string }) {
  const { user, db } = await getCurrentEmployee();

  const clients = await getClients({
    db,
    organizationUuid: user.organizationUuid,
  });

  return (
    <ClientList
      clients={clients}
      ClientCards={fromEntries(
        clients.map((client) => [
          client.uuid,
          <ClientCard
            client={client}
            orgSlug={orgSlug}
            className={`last-of-type:mb-4 ${client.uuid}`}
            key={client.uuid}
            data-id={client.uuid}
          />,
        ]),
      )}
    />
  );
}
