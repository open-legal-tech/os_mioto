"use client";

import { cardClasses } from "@mioto/design-system/Card";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { motion } from "framer-motion";
import { Search } from "../../../shared/components/Search/Search";
import { useSearch } from "../../../shared/components/Search/useSearch";
import { TreeCard, type TreeCardProps } from "./TreeCard";

type Props = {
  trees: TreeCardProps["tree"][];
  CLIENT_ENDPOINT: string;
};

export const TreeList = ({ trees, CLIENT_ENDPOINT }: Props) => {
  const t = useTranslations();
  const searchStore = useSearch({
    data: trees,
    sortOptions: {
      updatedAt: t("app.dashboard.sort-button.last-edit"),
      createdAt: t("app.dashboard.sort-button.created-at"),
    },
    initialSortOption: "updatedAt",
  });

  return (
    <>
      <Search
        label={t("app.dashboard.search.label")}
        store={searchStore}
        placeholder={t("app.dashboard.search.placeholder")}
      />
      <Stack className="gap-2 -mx-2 px-2 flex-1 overflow-y-auto isolate">
        {searchStore.filteredData.length > 0 ? (
          searchStore.filteredData.map((tree, index) => (
            <motion.div
              key={tree.uuid}
              layout
              transition={{ duration: 0.5 }}
              className="last-of-type:mb-4"
            >
              <TreeCard
                tree={tree}
                prefetch={index <= 1}
                CLIENT_ENDPOINT={CLIENT_ENDPOINT}
              />
            </motion.div>
          ))
        ) : (
          <Stack className="h-full" center>
            <Stack className={cardClasses()}>
              <Heading>{t("app.dashboard.empty")}</Heading>
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};
