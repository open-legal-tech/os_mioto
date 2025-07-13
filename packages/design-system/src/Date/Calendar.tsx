import { CalendarDate } from "@internationalized/date";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import {
  Calendar as AriaCalendar,
  CalendarGridHeader as AriaCalendarGridHeader,
  type CalendarProps as AriaCalendarProps,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarHeaderCell,
  DatePickerStateContext,
  type DateValue,
  Text,
  useLocale,
} from "react-aria-components";
import { Select } from "../Select";
import { focusRing } from "../shared/focusRing";
import { tv } from "../tailwind/tv";
import { Button } from "./Button";

const cellStyles = tv({
  extend: focusRing,
  base: "w-8 h-8 m-1 text-sm cursor-default rounded flex items-center justify-center",
  variants: {
    isSelected: {
      false: "text-gray9 hover:bg-gray3 pressed:bg-gray4",
      true: "bg-primary7 font-weak invalid:bg-danger3 text-white",
    },
    isDisabled: {
      true: "text-gray3 ",
    },
  },
});

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, "visibleDuration"> {
  errorMessage?: string;
}

export function Calendar({
  errorMessage,
  ...props
}: CalendarProps<CalendarDate>) {
  return (
    <AriaCalendar {...props} className="border border-gray5 rounded">
      <CalendarHeader />
      <CalendarGrid className="w-full">
        <CalendarGridHeader />
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} className={cellStyles} />}
        </CalendarGridBody>
      </CalendarGrid>
      {errorMessage && (
        <Text slot="errorMessage" className="text-sm text-danger5">
          {errorMessage}
        </Text>
      )}
    </AriaCalendar>
  );
}

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

const currentDate = new Date();
const currentCalendarDate = new CalendarDate(
  currentDate.getFullYear(),
  currentDate.getMonth() + 1,
  currentDate.getDate(),
);

export function CalendarHeader() {
  const { direction, locale } = useLocale();
  const state = React.useContext(DatePickerStateContext);
  const dateValue = state?.dateValue ?? currentCalendarDate;

  const months = getMonthNames(locale);
  const monthStore = Select.useSelectStore({
    value: dateValue.month.toString(),
    setValue: (value) => {
      if (typeof value !== "string") return;

      state?.setDateValue(
        new CalendarDate(dateValue.year, Number(value), dateValue.day),
      );
      state?.setOpen(true);
      monthStore.hide();
    },
    focusLoop: true,
  });

  const yearStore = Select.useSelectStore({
    value: dateValue?.year.toString() ?? currentDate.getFullYear().toString(),
    setValue: (value) => {
      state?.setDateValue(
        new CalendarDate(Number(value), dateValue.month, dateValue.day),
      );
      state?.setOpen(true);
      yearStore.hide();
    },
    focusLoop: true,
  });

  return (
    <header className="grid grid-cols-[max-content_1fr_1fr_max-content] gap-2 p-6 px-4">
      <Button
        square
        size="small"
        slot="previous"
        variant="secondary"
        colorScheme="gray"
        onPress={() => {
          const previous = monthStore.previous();
          if (!previous) return;
          return monthStore.setValue(previous);
        }}
      >
        {direction === "rtl" ? (
          <CaretRight aria-hidden />
        ) : (
          <CaretLeft aria-hidden />
        )}
      </Button>
      <Select.Root
        store={monthStore}
        options={months.map((monthName, index) => ({
          id: (index + 1).toString(),
          name: monthName,
          type: "option",
          data: {},
        }))}
      >
        <Select.Input
          variant="secondary"
          className="font-strong"
          size="small"
        />
        <Select.Content />
      </Select.Root>
      <Select.Root
        store={yearStore}
        options={years.map((year) => ({
          id: year.toString(),
          type: "option",
          name: year.toString(),
          data: {},
        }))}
      >
        <Select.Input
          variant="secondary"
          className="font-strong"
          size="small"
        />
        <Select.Content />
      </Select.Root>
      <Button
        square
        size="small"
        slot="next"
        variant="secondary"
        colorScheme="gray"
        onPress={() => {
          const next = monthStore.next();
          if (!next) return;
          return monthStore.setValue(next);
        }}
      >
        {direction === "rtl" ? (
          <CaretLeft aria-hidden />
        ) : (
          <CaretRight aria-hidden />
        )}
      </Button>
    </header>
  );
}

export function CalendarGridHeader() {
  return (
    <AriaCalendarGridHeader>
      {(day) => (
        <CalendarHeaderCell className="text-smallText text-gray-500 font-semibold">
          {day}
        </CalendarHeaderCell>
      )}
    </AriaCalendarGridHeader>
  );
}
