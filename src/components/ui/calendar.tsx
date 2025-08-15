"use client";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type CalendarProps = {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date; // dates before this are disabled
};

// Minimal inline calendar inspired by shadcn style
export function Calendar({ value, onChange, minDate }: CalendarProps) {
  const [cursor, setCursor] = useState<Date>(() => value ?? new Date());
  const selected = value ?? null;

  const minDay = minDate ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()) : null;

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday-based
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grid: Array<Date | null> = useMemo(() => {
    const cells: Array<Date | null> = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [startWeekday, daysInMonth, year, month]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

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
          const isDisabled = !!(date && minDay && date < minDay);
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


