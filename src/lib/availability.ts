export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Modality = "Online" | "Presencial";

export type WeeklyAvailability = {
  online?: Partial<Record<Weekday, string[]>>;
  presencial?: Partial<Record<Weekday, string[]>>;
};

// New slot-based availability model
export type AvailabilitySlot = {
  id: string;
  psychologistId: string;
  modality: Modality;
  // ISO UTC, e.g. "2025-08-20T18:00:00Z"
  date: string;
  status: "free" | "held" | "booked" | "canceled";
};

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Convert a time string (HH:MM) on a given date into a UTC ISO string.
 * Interprets time as local time of the current environment, then converts to UTC.
 */
function localTimeOnDateToUtcIso(day: Date, timeHHmm: string): string {
  const [hh, mm] = timeHHmm.split(":").map((x) => parseInt(x, 10));
  const local = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hh, mm, 0, 0);
  return new Date(Date.UTC(
    local.getUTCFullYear(),
    local.getUTCMonth(),
    local.getUTCDate(),
    local.getUTCHours(),
    local.getUTCMinutes(),
    0,
    0
  )).toISOString();
}

/**
 * Generate slots from a weekly availability template for a date range.
 */
export function generateSlotsFromWeekly(
  weekly: WeeklyAvailability | undefined,
  psychologistId: string,
  fromDate: Date,
  toDate: Date
): AvailabilitySlot[] {
  if (!weekly) return [];
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  const end = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());
  const weekdays: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
  const slots: AvailabilitySlot[] = [];

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const weekday = weekdays[(d.getDay() + 6) % 7];
    const forOnline = weekly.online?.[weekday] ?? [];
    const forPresencial = weekly.presencial?.[weekday] ?? [];

    forOnline.forEach((t) => {
      const iso = localTimeOnDateToUtcIso(d, t);
      slots.push({
        id: `${psychologistId}|on|${iso}`,
        psychologistId,
        modality: "Online",
        date: iso,
        status: "free"
      });
    });
    forPresencial.forEach((t) => {
      const iso = localTimeOnDateToUtcIso(d, t);
      slots.push({
        id: `${psychologistId}|pr|${iso}`,
        psychologistId,
        modality: "Presencial",
        date: iso,
        status: "free"
      });
    });
  }

  return slots;
}

/**
 * Group slots by date key and modality, keeping only free slots by default.
 */
export function groupSlotsByDateAndModality(slots: AvailabilitySlot[], includeStatuses: Array<AvailabilitySlot["status"]> = ["free"]): {
  online: Record<string, AvailabilitySlot[]>;
  presencial: Record<string, AvailabilitySlot[]>;
} {
  const filtered = slots.filter((s) => includeStatuses.includes(s.status));
  const online: Record<string, AvailabilitySlot[]> = {};
  const presencial: Record<string, AvailabilitySlot[]> = {};
  for (const slot of filtered) {
    const key = formatDateKey(new Date(slot.date));
    const bucket = slot.modality === "Online" ? online : presencial;
    if (!bucket[key]) bucket[key] = [];
    bucket[key].push(slot);
  }
  // Sort by time ascending
  for (const key of Object.keys(online)) online[key].sort((a, b) => a.date.localeCompare(b.date));
  for (const key of Object.keys(presencial)) presencial[key].sort((a, b) => a.date.localeCompare(b.date));
  return { online, presencial };
}

/**
 * Render a local time label (HH:MM) for a UTC ISO date.
 */
export function formatLocalTimeLabel(isoUtc: string): string {
  const d = new Date(isoUtc);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}



