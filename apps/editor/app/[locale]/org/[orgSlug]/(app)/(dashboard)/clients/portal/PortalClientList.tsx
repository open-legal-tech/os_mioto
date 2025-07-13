import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { fromEntries } from "remeda";
import { ClientCard } from "../components/ClientCard";
import { ClientList } from "../components/ClientList";
import { getClients } from "../shared/getClients";

export async function PortalClientList({ orgSlug }: { orgSlug: string }) {
  const { user, db } = await getCurrentEmployee();

  const clients = (
    await getClients({
      db,
      organizationUuid: user.organizationUuid,
    })
  ).filter((client) => client.hasPortalAccess);

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
