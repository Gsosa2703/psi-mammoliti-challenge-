"use client";
import { useEffect, useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AvailabilitySlot, WeeklyAvailability, formatDateKey, formatLocalTimeLabel, generateSlotsFromWeekly, groupSlotsByDateAndModality } from "@/lib/availability";
import { saveSession, ScheduledSession } from "@/lib/sessions";

type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  experienceYears: number;
  sessionMinutes: number;
  priceUSD: number;
  bio: string;
  weeklyAvailability?: WeeklyAvailability;
  slots?: AvailabilitySlot[];
};

type Props = {
  open: boolean;
  data: Psychologist | null;
  onClose: () => void;
};


export default function ProfileModal({ open, data, onClose }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedDate(new Date());
      setSelectedTime(null);
      setConfirmation(null);
    }
  }, [open]);

  const grouped = useMemo(() => {
    if (!data) return { online: {}, presencial: {} } as ReturnType<typeof groupSlotsByDateAndModality>;
    const from = new Date();
    const to = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
    const slots = data.slots ?? generateSlotsFromWeekly(data.weeklyAvailability, data.id, from, to);
    return groupSlotsByDateAndModality(slots);
  }, [data]);

  const slotsForSelectedDay = useMemo(() => {
    if (!data) return [] as AvailabilitySlot[];
    const key = formatDateKey(selectedDate);
    // Show both modalities in modal compact view
    return [ ...(grouped.online[key] ?? []), ...(grouped.presencial[key] ?? []) ];
  }, [data, selectedDate, grouped]);

  if (!open || !data) return null;

  function submit() {
    if (!selectedTime || !form.name || !form.email || !data) return;
    const readable = `${selectedDate.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long" })} ${formatLocalTimeLabel(selectedTime)}`;
    setConfirmation(`Listo, reservaste con ${data.name} para ${readable}. Recibirás un email de confirmación.`);
    try {
      const newSession: ScheduledSession = {
        id: `${data.id}|modal|${selectedTime}`,
        slotId: undefined,
        psychologistId: data.id,
        psychologistName: data.name,
        modality: "Online",
        datetime: selectedTime,
        createdAt: new Date().toISOString(),
        status: "scheduled",
        sessionMinutes: data.sessionMinutes,
        priceUSD: data.priceUSD,
        notes: form.motive || undefined
      };
      saveSession(newSession);
    } catch {}
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
            <div className="mt-3">
              <Calendar value={selectedDate} onChange={setSelectedDate} />
            </div>
            <div className="mt-3">
              <div className="text-xs text-black/60 dark:text-white/60">
                Selecciona tu horario
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {slotsForSelectedDay.length === 0 && (
                <span className="text-xs text-black/60 dark:text-white/60">Sin turnos para ese día</span>
              )}
              {slotsForSelectedDay.map((slot) => (
                <Button
                  key={slot.id}
                  size="sm"
                  variant={slot.date === selectedTime ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot.date)}
                >
                  {formatLocalTimeLabel(slot.date)}
                </Button>
              ))}
            </div>

            <h3 className="mt-5 text-sm font-semibold">Información Personal</h3>
            <div className="mt-2 space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" placeholder="tu nombre completo" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="gaby@example.com" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="+54 9 11 1111" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="motive">Motivo de la consulta</Label>
                <Textarea id="motive" className="h-24 resize-none" placeholder="Describe brevemente el motivo de la consulta" value={form.motive} onChange={(e) => setForm((f) => ({ ...f, motive: e.target.value }))} />
              </div>
            </div>

            {confirmation ? (
              <div className="mt-3 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-xs text-green-700 dark:text-green-300">
                {confirmation}
              </div>
            ) : null}

            <div className="mt-4 flex gap-2">
              <Button onClick={onClose} variant="outline" className="w-1/2">Cancelar</Button>
              <Button onClick={submit} disabled={!selectedTime || !form.name || !form.email} className="w-1/2">Confirmar Cita</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


