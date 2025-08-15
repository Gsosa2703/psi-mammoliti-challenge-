"use client";
import { useMemo, useState } from "react";
import dayjs from "@/lib/dayjs";
import { cn } from "@/lib/utils";

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date; // dates before this are disabled
  maxDate?: Date; // dates after this are disabled
  isDateDisabled?: (date: Date) => boolean; // additional predicate
};

export function Calendar({ value, onChange, minDate, maxDate, isDateDisabled }: CalendarProps) {
  const [cursor, setCursor] = useState<Date>(() => value ?? new Date());
  const selected = value ?? null;

  const minDay = minDate ? dayjs(minDate).startOf("day") : null;
  const maxDay = maxDate ? dayjs(maxDate).startOf("day") : null;

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = dayjs(new Date(year, month, 1));
  const startWeekday = ((firstOfMonth.day() + 6) % 7);
  const daysInMonth = firstOfMonth.daysInMonth();

  const grid: Array<Date | null> = useMemo(() => {
    const cells: Array<Date | null> = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [startWeekday, daysInMonth, year, month]);

  const months = [
    dayjs().month(0).format("MMMM"),
    dayjs().month(1).format("MMMM"),
    dayjs().month(2).format("MMMM"),
    dayjs().month(3).format("MMMM"),
    dayjs().month(4).format("MMMM"),
    dayjs().month(5).format("MMMM"),
    dayjs().month(6).format("MMMM"),
    dayjs().month(7).format("MMMM"),
    dayjs().month(8).format("MMMM"),
    dayjs().month(9).format("MMMM"),
    dayjs().month(10).format("MMMM"),
    dayjs().month(11).format("MMMM")
  ];

  const weekdays = [
    dayjs().day(1).format("dd").toUpperCase(),
    dayjs().day(2).format("dd").toUpperCase(),
    dayjs().day(3).format("dd").toUpperCase(),
    dayjs().day(4).format("dd").toUpperCase(),
    dayjs().day(5).format("dd").toUpperCase(),
    dayjs().day(6).format("dd").toUpperCase(),
    dayjs().day(0).format("dd").toUpperCase()
  ];

  return (
    <div className="w-full rounded-xl border border-black/10 p-3 dark:border-white/10">
      <div className="flex items-center justify-between">
        <button
          className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/20"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          ←
        </button>
        <div className="text-sm font-medium">{months[month]} {year}</div>
        <button
          className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/20"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          →
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[10px] text-black/60 dark:text-white/60">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {grid.map((date, idx) => {
          const isSelected = selected && date && date.toDateString() === selected.toDateString();
          const afterMax = !!(date && maxDay && dayjs(date).isAfter(maxDay));
          const beforeMin = !!(date && minDay && dayjs(date).isBefore(minDay));
          const predicate = !!(date && isDateDisabled?.(date));
          const isDisabled = beforeMin || afterMax || predicate;
          return (
            <button
              key={idx}
              disabled={!date || isDisabled}
              onClick={() => date && !isDisabled && onChange?.(date)}
              className={cn(
                "aspect-square rounded-md text-sm disabled:opacity-40 disabled:cursor-not-allowed",
                date ? "hover:bg-black/5 dark:hover:bg-white/10" : "opacity-0",
                isSelected ? "bg-black text-white dark:bg-white dark:text-black" : ""
              )}
            >
              {date ? date.getDate() : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}


