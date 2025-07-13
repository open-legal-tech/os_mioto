import { useFormatter } from "@mioto/locale";
import { parseISO } from "date-fns";
import { type KeyAttributesOptions, matchSorter } from "match-sorter";
import * as React from "react";
import { pipe } from "remeda";
import { SortButton as GenericSortButton } from "./SortButton";

const fuzzySearch = <TData extends { updatedAt: string }>(
  data: TData[],
  search: string,
  formatDate: (date: Date) => string,
  keys?: KeyAttributesOptions<TData>[],
): TData[] => {
  return matchSorter(data, search, {
    keys: [
      "name",
      (data) => formatDate(parseISO(data.updatedAt)),
      ...(keys ?? []),
    ],
  });
};

const sortByKey = <TData extends Data>(data: TData[], key: string): TData[] => {
  return matchSorter(data, "", { keys: [key] });
};

type Data = {
  updatedAt: string;
  name?: string;
};

export type SortDirections = "ascending" | "descending";

const sortData =
  (sort: string, direction: SortDirections) =>
  <TData extends Data>(data: TData[]) =>
    direction === "descending"
      ? sortByKey(data, sort)
      : sortByKey(data, sort).reverse();

const searchData =
  <TData extends Data>(
    search: string,
    formatDate: (date: Date) => string,
    keys?: KeyAttributesOptions<TData>[],
  ) =>
  (data: TData[]) =>
    fuzzySearch(data, search, formatDate, keys);

export function useSearch<
  TData extends Data,
  TSortOptions extends Record<string, string>,
>({
  data,
  sortOptions,
  initialSortOption,
  searchKeys,
}: {
  data: TData[];
  sortOptions: TSortOptions;
  initialSortOption: keyof TSortOptions;
  searchKeys?: KeyAttributesOptions<TData>[];
}) {
  const format = useFormatter();
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState<keyof TSortOptions>(initialSortOption);
  const [direction, setDirection] = React.useState<SortDirections>("ascending");

  const handleFilterChange = React.useCallback(
    function handleFilterChange() {
      return pipe(
        data,
        (x) =>
          search ? searchData(search, format.relativeTime, searchKeys)(x) : x,
        (x) => (sort ? sortData(sort as string, direction)(x) : x),
      );
    },
    [data, search, format.relativeTime, searchKeys, sort, direction],
  );

  const SortButton = React.useCallback(
    () => (
      <GenericSortButton
        sort={sort as string}
        direction={direction}
        options={sortOptions}
        setDirection={(direction) => {
          setDirection(direction);
          handleFilterChange();
        }}
        setSort={(option) => {
          setSort(option);
          handleFilterChange();
        }}
        resetSort={() => {
          setSort(initialSortOption);
          setDirection("ascending");
          handleFilterChange();
        }}
      />
    ),
    [sort, direction, sortOptions, handleFilterChange, initialSortOption],
  );

  return {
    filteredData: handleFilterChange(),
    search,
    sort,
    direction,
    SortButton,
    setDirection,
    setSearch,
    setSort,
  };
}
