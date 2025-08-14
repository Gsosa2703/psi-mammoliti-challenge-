"use client";
import Link from "next/link";
import data from "@/data/psychologists.json";
import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { notFound, useParams } from "next/navigation";

type WeeklyAvailability = {
  mon: string[];
  tue: string[];
  wed: string[];
  thu: string[];
  fri: string[];
  sat: string[];
  sun: string[];
};

type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  experienceYears: number;
  sessionMinutes: number;
  priceUSD: number;
  bio: string;
  weeklyAvailability: WeeklyAvailability;
};

export default function ProfessionalPage() {
  const params = useParams<{ id: string }>();
  const psychologists = data as unknown as Psychologist[];
  const prof = psychologists.find((p) => p.id === params.id);
  if (!prof) notFound();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  const timesForSelectedDay = useMemo(() => {
    const jsDow = selectedDate.getDay();
    const mondayBased = (jsDow + 6) % 7;
    const keys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
    const key = keys[mondayBased];
    return prof.weeklyAvailability[key] ?? [];
  }, [selectedDate, prof]);

  function submit() {
    if (!selectedTime || !form.name || !form.email) return;
    const readable = `${selectedDate.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long" })} ${selectedTime}`;
    setConfirmation(`Listo, reservaste con ${prof.name} para ${readable}. Recibirás un email de confirmación (simulado).`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-center gap-3">
        <Link href="/" className="rounded-full border border-black/15 px-3 py-1 text-sm dark:border-white/20">←</Link>
        <h1 className="text-base font-semibold">Perfil del Profesional</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_360px]">
        <div>
          <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={prof.image} alt={prof.name} className="aspect-[16/9] w-full object-cover" />
          </div>
          <div className="mt-3 rounded-2xl border border-black/10 p-3 dark:border-white/10">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold leading-none">{prof.name}</h3>
                <p className="text-xs text-black/60 dark:text-white/60">{prof.experienceYears}+ años de experiencia</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">USD {prof.priceUSD}</div>
                <div className="text-xs text-black/60 dark:text-white/60">{prof.sessionMinutes} min</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {prof.specialties.map((s) => (
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
            <div className="text-xs text-black/60 dark:text-white/60">Selecciona tu horario</div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {timesForSelectedDay.length === 0 && (
              <span className="text-xs text-black/60 dark:text-white/60">Sin turnos para ese día</span>
            )}
            {timesForSelectedDay.map((t) => (
              <Button key={t} size="sm" variant={t === selectedTime ? "default" : "outline"} onClick={() => setSelectedTime(t)}>
                {t}
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
            <Button asChild variant="outline" className="w-1/2">
              <Link href="/">Cancelar</Link>
            </Button>
            <Button onClick={submit} disabled={!selectedTime || !form.name || !form.email} className="w-1/2">
              Confirmar Cita
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}


