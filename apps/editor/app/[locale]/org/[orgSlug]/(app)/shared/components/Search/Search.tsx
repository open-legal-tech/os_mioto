"use client";

import { Form } from "@mioto/design-system/Form";

import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { useSearch } from "./useSearch";

type SearchProps = {
  placeholder?: string;
  label: string;
  store: ReturnType<typeof useSearch<any, Record<any, string>>>;
};

export function Search({ placeholder, label, store }: SearchProps) {
  const methods = Form.useForm({
    defaultValues: { search: store.search },
  });

  return (
    <Form.Provider methods={methods}>
      <Form.Root className="gap-2 justify-between flex-row items-center flex-wrap">
        <Form.Field Label={label} layout="no-label" className="basis-[400px]">
          <Form.Input
            {...methods.register("search", {
              onChange: (event) => store.setSearch(event.target.value),
            })}
            name="search"
            Icon={(props) => <MagnifyingGlass {...props} />}
            placeholder={placeholder}
            className="bg-white"
          />
        </Form.Field>
        <store.SortButton />
      </Form.Root>
    </Form.Provider>
  );
}
