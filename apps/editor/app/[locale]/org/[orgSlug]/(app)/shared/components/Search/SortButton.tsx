import { Button, buttonClasses } from "@mioto/design-system/Button";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { IconButton } from "@mioto/design-system/IconButton";
import { useTranslations } from "@mioto/locale";
import { ArrowUp, X } from "@phosphor-icons/react/dist/ssr";

export type SortButtonProps<TOptions extends Record<string, string>> = {
  sort: keyof TOptions;
  options: TOptions;
  direction: "ascending" | "descending";
  setSort: React.Dispatch<keyof TOptions>;
  setDirection: React.Dispatch<"ascending" | "descending">;
  resetSort: () => void;
};

export function SortButton<TOptions extends Record<string, string>>({
  sort,
  options,
  direction,
  setSort,
  setDirection,
  resetSort,
}: SortButtonProps<TOptions>) {
  const t = useTranslations();

  return (
    <DropdownMenu.Root>
      <div
        className={buttonClasses({
          variant: "secondary",
          size: "small",
          colorScheme: "gray",
          className: `${
            sort !== "updatedAt" || direction !== "ascending"
              ? "colorScheme-primary"
              : "colorScheme-gray"
          } gap-0 p-0 md:p-0`,
        })}
      >
        <DropdownMenu.Trigger asChild>
          <Button data-direction={direction} variant="ghost" size="small">
            {t("components.search.sort-button.label")}
            {sort !== "updatedAt" || direction !== "ascending"
              ? `: ${options[sort]}`
              : ""}
            {direction !== "ascending" || sort !== "updatedAt" ? (
              <ArrowUp
                className={`${
                  direction === "descending" ? "rotate-180" : "rotate-0"
                }`}
              />
            ) : null}
          </Button>
        </DropdownMenu.Trigger>
        {sort !== "updatedAt" || direction !== "ascending" ? (
          <IconButton
            size="small"
            variant="ghost"
            square
            onClick={() => resetSort()}
            className="pl-0"
            tooltip={{
              children: t("components.search.sort-button.remove-sort.tooltip"),
            }}
          >
            <X />
          </IconButton>
        ) : null}
      </div>

      <DropdownMenu.Content align="end">
        <DropdownMenu.RadioGroup
          items={[
            {
              value: "ascending",
              label: t("components.search.sort-button.ascending"),
            },
            {
              value: "descending",
              label: t("components.search.sort-button.descending"),
            },
          ]}
          value={direction}
          onValueChange={(newOption) => setDirection(newOption)}
        />
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup
          items={Object.entries(options).map(([value, label]) => ({
            value,
            label,
          }))}
          value={sort as string}
          onValueChange={(newOption) => setSort(newOption)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
