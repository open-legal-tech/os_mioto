"use client";

import { useLocale } from "@mioto/locale";
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { addYears, subYears } from "date-fns";
import { de, enUS } from "date-fns/locale";
import * as React from "react";
import { DayPicker } from "react-day-picker";
import { Button, buttonClasses } from "../Button";
import { twMerge } from "../tailwind/merge";

const years = Array.from({ length: 2100 - 1900 + 1 }, (v, k) => 1900 + k);

function getMonthNames(locale = "en", format = "long" as const) {
  const formatter = new Intl.DateTimeFormat(locale, {
    month: format,
    timeZone: "UTC",
  });

  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => {
    const mm = month < 10 ? `0${month}` : month;
    return new Date(`2017-${mm}-01T00:00:00+00:00`);
  });

  return months.map((date) => formatter.format(date));
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const locale = useLocale();

  return (
    <DayPicker
      hidden={{
        before: subYears(new Date(), 300),
        after: addYears(new Date(), 100),
      }}
      locale={locale === "de" ? de : enUS}
      showOutsideDays={showOutsideDays}
      className={twMerge("p-3", className)}
      captionLayout="dropdown"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        nav: "space-x-1 flex items-center",
        nav_button: buttonClasses({
          variant: "tertiary",
          className: "h-7 w-7 p-0",
        }),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-gray10 rounded w-8 text-smallText font-smallHeading",
        row: "flex w-full mt-2",
        cell: "p-0",
        ...classNames,
      }}
      components={{
        Chevron: (props) => {
          if (props.orientation === "left") {
            return <CaretRight className="h-4 w-4" {...props} />;
          }
          return <CaretLeft className="h-4 w-4" {...props} />;
        },
        Day: ({ modifiers }) => {
          const buttonRef = React.useRef<HTMLButtonElement>(null);

          const isSingleDateSelect =
            (modifiers.range_start && modifiers.range_end != null) ||
            (modifiers.range_end && modifiers.range_start != null);

          return (
            <Button
              variant="tertiary"
              className={twMerge(
                "h-8 w-8",
                modifiers.selected &&
                  "bg-primary3 border-primary7 border hover:border-unset",
                !isSingleDateSelect &&
                  modifiers.range_end &&
                  "rounded-l-none border-l-0",
                !isSingleDateSelect &&
                  modifiers.range_start &&
                  "rounded-r-none border-r-0",
                isSingleDateSelect && modifiers.today && "text-primary8",
                modifiers.range_middle && "bg-primary2 rounded-none border-x-0",
                modifiers.outside && "text-gray9/75",
                modifiers.hidden && "invisible",
                className,
              )}
              ref={buttonRef}
            />
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
