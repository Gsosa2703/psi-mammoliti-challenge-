"use client";
import { useEffect, useMemo, useState } from "react";

type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  experienceYears: number;
  sessionMinutes: number;
  priceUSD: number;
  bio: string;
  weeklyAvailability: Record<string, string[]>;
};

type Props = {
  open: boolean;
  data: Psychologist | null;
  onClose: () => void;
};

const weekdayKeys: Array<{ key: keyof Psychologist["weeklyAvailability"]; label: string }> = [
  { key: "mon", label: "Lun" },
  { key: "tue", label: "Mar" },
  { key: "wed", label: "Mié" },
  { key: "thu", label: "Jue" },
  { key: "fri", label: "Vie" },
  { key: "sat", label: "Sáb" },
  { key: "sun", label: "Dom" }
];

export default function ProfileModal({ open, data, onClose }: Props) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedDayIdx(0);
      setSelectedTime(null);
      setConfirmation(null);
    }
  }, [open]);

  const timesForSelectedDay = useMemo(() => {
    if (!data) return [] as string[];
    const key = weekdayKeys[selectedDayIdx].key as string;
    return data.weeklyAvailability[key] ?? [];
  }, [data, selectedDayIdx]);

  if (!open || !data) return null;

  function submit() {
    if (!selectedTime || !form.name || !form.email) return;
    const date = new Date();
    // Move date to the next occurrence of selected day
    const targetDow = selectedDayIdx; // 0..6, starting Monday in our array
    const currentDow = (date.getDay() + 6) % 7; // convert to Monday=0
    const delta = (targetDow - currentDow + 7) % 7;
    date.setDate(date.getDate() + delta);
    const readable = `${date.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "short" })} ${selectedTime}`;
    setConfirmation(`Listo, reservaste con ${data.name} para ${readable}. Recibirás un email de confirmación (simulado).`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-6">
      <div className="h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-white shadow-xl dark:bg-black sm:h-auto sm:rounded-3xl">
        <div className="flex items-center gap-3 border-b border-black/10 p-4 dark:border-white/10">
          <button onClick={onClose} className="rounded-full border border-black/15 px-3 py-1 text-sm dark:border-white/20">Atrás</button>
          <h2 className="text-base font-semibold">Perfil del Profesional</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[1fr_360px]">
          <div>
            <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.image} alt={data.name} className="aspect-[16/9] w-full object-cover" />
            </div>
            <div className="mt-3 rounded-2xl border border-black/10 p-3 dark:border-white/10">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold leading-none">{data.name}</h3>
                  <p className="text-xs text-black/60 dark:text-white/60">{data.experienceYears}+ años de experiencia</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">USD {data.priceUSD}</div>
                  <div className="text-xs text-black/60 dark:text-white/60">{data.sessionMinutes} min</div>
                </div>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {data.specialties.map((s) => (
                  <span key={s} className="rounded-md border border-black/10 px-2 py-1 text-[10px] text-black/70 dark:border-white/20 dark:text-white/70">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-11/12 rounded bg-black/10 dark:bg-white/10" />
              <div className="h-3 w-4/5 rounded bg-black/10 dark:bg-white/10" />
            </div>
          </div>
          <div className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
            <h3 className="text-sm font-semibold">Próxima disponibilidad</h3>
            <div className="mt-3 flex gap-1 overflow-x-auto pb-1">
              {weekdayKeys.map((d, idx) => (
                <button
                  key={d.key}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={
                    "min-w-[48px] rounded-xl border px-3 py-2 text-xs " +
                    (idx === selectedDayIdx
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/15 text-black/80 dark:border-white/20 dark:text-white/80")
                  }
                >
                  {d.label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {timesForSelectedDay.length === 0 && (
                <span className="text-xs text-black/60 dark:text-white/60">Sin turnos para ese día</span>
              )}
              {timesForSelectedDay.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={
                    "rounded-xl border px-3 py-2 text-xs " +
                    (t === selectedTime
                      ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                      : "border-black/15 text-black/80 hover:border-black/30 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40")
                  }
                >
                  {t}
                </button>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-semibold">Información Personal</h3>
            <div className="mt-2 space-y-2">
              <input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/20 dark:focus:border-white/40"
              />
              <input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/20 dark:focus:border-white/40"
              />
              <input
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/20 dark:focus:border-white/40"
              />
              <textarea
                placeholder="Motivo de la consulta"
                value={form.motive}
                onChange={(e) => setForm((f) => ({ ...f, motive: e.target.value }))}
                className="h-24 w-full resize-none rounded-xl border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/20 dark:focus:border-white/40"
              />
            </div>

            {confirmation ? (
              <div className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-300">
                {confirmation}
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <button onClick={onClose} className="w-1/2 rounded-xl border border-black/15 px-4 py-2 text-sm dark:border-white/20">
                Cancelar
              </button>
              <button
                onClick={submit}
                disabled={!selectedTime || !form.name || !form.email}
                className="w-1/2 rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
              >
                Confirmar Cita
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


