"use client";

import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { Search } from "../../../shared/components/Search/Search";
import { useSearch } from "../../../shared/components/Search/useSearch";
import type { Client } from "./ClientType";
import { statusMap } from "./clientStatusMap";

export type ClientListProps = {
  clients: Client[];
  ClientCards: Record<string, React.ReactElement<{ className: string }>>;
};

export function ClientList({ clients, ClientCards }: ClientListProps) {
  const t = useTranslations();
  const filterStore = useSearch({
    data: clients,
    sortOptions: {
      updatedAt: t("app.client.list.sort.updatedAt"),
      createdAt: t("app.client.list.sort.createdAt"),
    },
    initialSortOption: "updatedAt",
    searchKeys: [
      { key: "referenceNumber" },
      { key: "email" },
      { key: "name" },
      { key: (item) => t(statusMap[item.status].label) },
    ],
  });

  return (
    <>
      <Search
        label={t("app.client.list.search.label")}
        store={filterStore}
        placeholder={t("app.client.list.search.placeholder")}
      />
      <Stack className="gap-2 -mx-2 px-2 flex-1 h-full overflow-y-auto isolate">
        {filterStore.filteredData.length > 0 ? (
          filterStore.filteredData.map((client) => ClientCards[client.uuid])
        ) : (
          <Stack className="h-full" center>
            <Stack className={cardClasses()}>
              <Heading>{t("app.client-list.empty")}</Heading>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
}
