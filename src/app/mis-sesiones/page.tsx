"use client";
import { useEffect, useMemo, useState } from "react";
import { getSessions, updateSessionStatus, deleteSession, ScheduledSession } from "@/lib/sessions";
import dayjs from "@/lib/dayjs";
import Link from "next/link";

function formatLocalDateTime(isoUtc: string): string {
  return dayjs(isoUtc).local().format("ddd, DD MMM YYYY HH:mm");
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const upcoming = useMemo(() => sessions.filter((s) => s.status === "scheduled"), [sessions]);
  const past = useMemo(() => sessions.filter((s) => s.status !== "scheduled"), [sessions]);

  function cancel(id: string) {
    updateSessionStatus(id, "canceled");
    setSessions(getSessions());
  }

  function remove(id: string) {
    deleteSession(id);
    setSessions(getSessions());
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-full border border-black/15 px-3 py-1 text-sm dark:border-white/20">←</Link>
        <h1 className="text-base font-semibold">Mis sesiones</h1>
      </div>

      <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
        <h2 className="text-sm font-semibold">Próximas</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-xs text-black/60 dark:text-white/60">No tienes sesiones programadas.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {upcoming.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
                <div>
                  <div className="font-medium">{s.psychologistName} <span className="ml-2 rounded-md border px-1.5 py-0.5 text-[10px] opacity-80">{s.modality}</span></div>
                  <div className="text-xs text-black/60 dark:text-white/60">{formatLocalDateTime(s.datetime)} · {s.sessionMinutes} min · USD {s.priceUSD}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => cancel(s.id)} className="rounded-md border border-black/15 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">Cancelar</button>
                  <button onClick={() => remove(s.id)} className="rounded-md border border-black/15 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
        <h2 className="text-sm font-semibold">Historial</h2>
        {past.length === 0 ? (
          <p className="mt-2 text-xs text-black/60 dark:text-white/60">No hay historial.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {past.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-black/10 p-3 text-sm dark:border-white/10">
                <div>
                  <div className="font-medium">{s.psychologistName} <span className="ml-2 rounded-md border px-1.5 py-0.5 text-[10px] opacity-80">{s.modality}</span></div>
                  <div className="text-xs text-black/60 dark:text-white/60">{formatLocalDateTime(s.datetime)} · {s.sessionMinutes} min · USD {s.priceUSD} · {s.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => remove(s.id)} className="rounded-md border border-black/15 px-3 py-1 text-xs hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}


