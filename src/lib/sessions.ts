export type ScheduledSession = {
  id: string;
  slotId?: string;
  psychologistId: string;
  psychologistName: string;
  modality: "Online" | "Presencial";
  datetime: string; // ISO UTC
  createdAt: string; // ISO UTC
  status: "scheduled" | "canceled";
  sessionMinutes: number;
  priceUSD: number;
  notes?: string;
};

const STORAGE_KEY = "scheduled_sessions_v1";

function safeParse(json: string | null): ScheduledSession[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) return parsed as ScheduledSession[];
    return [];
  } catch {
    return [];
  }
}

export function getSessions(): ScheduledSession[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveSession(session: ScheduledSession): void {
  if (typeof window === "undefined") return;
  const all = getSessions();
  const existsIdx = all.findIndex((s) => s.id === session.id);
  if (existsIdx >= 0) all[existsIdx] = session; else all.push(session);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function updateSessionStatus(id: string, status: ScheduledSession["status"]): void {
  if (typeof window === "undefined") return;
  const all = getSessions().map((s) => (s.id === id ? { ...s, status } : s));
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteSession(id: string): void {
  if (typeof window === "undefined") return;
  const all = getSessions().filter((s) => s.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}


