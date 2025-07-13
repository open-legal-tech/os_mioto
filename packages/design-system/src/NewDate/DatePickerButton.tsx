import {
  type DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from "@mioto/locale";
import { Calendar as CalendarIcon } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import type { DateRange } from "react-day-picker";
import type { ButtonProps } from "../Button";
import { IconButton } from "../IconButton";
import { twMerge } from "../tailwind/merge";

const dateStyleOptions: DateTimeFormatOptions = {
  dateStyle: "medium",
} as const;

export const DatePickerButton = React.forwardRef<
  HTMLButtonElement,
  { date?: Date | DateRange; mode?: "range" | "single" } & ButtonProps
>(({ date, className, mode = "single", ...props }, ref) => {
  const { dateTime } = useFormatter();
  const t = useTranslations();

  let dateString: React.ReactNode = (
    <span>{t("components.date-picker.placeholder")}</span>
  );

  if (date instanceof Date) {
    dateString = dateTime(date, "PPP");
  } else {
    if (date?.from) {
      if (date?.to) {
        dateString = (
          <>
            {dateTime(date.from, dateStyleOptions)} -{" "}
            {dateTime(date.to, dateStyleOptions)}
          </>
        );
      } else {
        dateString = dateTime(date.from, dateStyleOptions);
      }
    }
  }

  return (
    <div
      className={twMerge(
        "border border-gray5 rounded grid gap-2 overflow-hidden pl-2",
        mode === "range"
          ? "grid-cols-[1fr_max-content_1fr_max-content]"
          : "grid-cols-[1fr_max-content]",
        className,
      )}
    >
      {mode === "range" ? (
        <>
          <input
            className="h-full w-full focus-visible:inner-focus"
            placeholder="TT/MM/JJJJ"
          />
          <span className="self-center">-</span>
          <input
            className="h-full w-full focus-visible:inner-focus"
            placeholder="TT/MM/JJJJ"
          />
        </>
      ) : (
        <input
          className="h-full w-full focus-visible:inner-focus"
          placeholder="TT/MM/JJJJ"
        />
      )}
      <IconButton
        tooltip={{ children: "Open Calendar" }}
        ref={ref}
        variant="tertiary"
        className="rounded-none border-0 border-l border-gray5"
        {...props}
      >
        <CalendarIcon />
      </IconButton>
    </div>
  );
});
