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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DaySlots = {
  mon: string[];
  tue: string[];
  wed: string[];
  thu: string[];
  fri: string[];
  sat: string[];
  sun: string[];
};

type WeeklyAvailability = {
  online: DaySlots;
  presencial: DaySlots;
};

type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  modalities: Array<"Online" | "Presencial">;
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
  const initialModality: "Online" | "Presencial" = (prof?.modalities?.includes("Online") ? "Online" : "Presencial");
  const [selectedModality, setSelectedModality] = useState<"Online" | "Presencial">(initialModality);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", motive: "" });
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const userTimezone = useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const offsetMinutes = new Date().getTimezoneOffset();
      const sign = offsetMinutes <= 0 ? "+" : "-";
      const abs = Math.abs(offsetMinutes);
      const hh = String(Math.floor(abs / 60)).padStart(2, "0");
      const mm = String(abs % 60).padStart(2, "0");
      return `${tz} (UTC${sign}${hh}:${mm})`;
    } catch {
      return "UTC";
    }
  }, []);

  const timesForSelectedDay = useMemo(() => {
    const jsDow = selectedDate.getDay();
    const mondayBased = (jsDow + 6) % 7;
    const keys = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
    const key = keys[mondayBased];
    if (!prof?.modalities?.includes(selectedModality)) return [] as string[];
    const modalityKey = selectedModality === "Online" ? "online" : "presencial";
    const slots = prof?.weeklyAvailability?.[modalityKey]?.[key];
    return (slots as string[] | undefined) ?? [];
  }, [selectedDate, prof, selectedModality]);

  function changeModality(mod: "Online" | "Presencial") {
    setSelectedModality(mod);
    setSelectedTime(null);
  }

  function submit() {
    if (!selectedTime || !form.name || !form.email) return;
    const readable = `${selectedDate.toLocaleDateString(undefined, { weekday: "long", day: "2-digit", month: "long" })} ${selectedTime}`;
    setConfirmation(`Listo, reservaste (${selectedModality}) con ${prof?.name ?? ""} para ${readable}. Recibirás un email de confirmación (simulado).`);
    setOpenConfirm(true);
  }

  return (
    <div>
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
            {prof.modalities?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {prof.modalities.includes("Online") && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-blue-300 bg-blue-50 px-2.5 py-1 text-[10px] font-medium text-blue-700 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                      <path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v8.25A2.25 2.25 0 0 1 18.75 15H5.25A2.25 2.25 0 0 1 3 13.5V5.25z"/>
                      <path d="M6 18.75A.75.75 0 0 1 6.75 18h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 18.75z"/>
                    </svg>
                    Online
                  </span>
                )}
                {prof.modalities.includes("Presencial") && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                      <path fill-rule="evenodd" d="M12 2.25c-4.28 0-7.75 3.47-7.75 7.75 0 4.12 3.19 8.48 6.33 10.96.85.67 1.99.67 2.84 0 3.14-2.48 6.33-6.84 6.33-10.96 0-4.28-3.47-7.75-7.75-7.75zm0 10.25a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" clip-rule="evenodd"/>
                    </svg>
                    Presencial
                  </span>
                )}
              </div>
            ) : null}
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
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              variant={selectedModality === "Online" ? "default" : "outline"}
              onClick={() => changeModality("Online")}
              disabled={!prof.modalities.includes("Online")}
            >
              Online
            </Button>
            <Button
              size="sm"
              variant={selectedModality === "Presencial" ? "default" : "outline"}
              onClick={() => changeModality("Presencial")}
              disabled={!prof.modalities.includes("Presencial")}
            >
              Presencial
            </Button>
          </div>
          <div className="mt-3">
            <Calendar value={selectedDate} onChange={setSelectedDate} minDate={new Date()} />
          </div>
          <div className="mt-3">
            <div className="text-xs text-black/60 dark:text-white/60">Selecciona tu horario ({selectedModality})</div>
            <div className="mt-1 text-[10px] text-black/50 dark:text-white/50">Horarios mostrados en tu zona: {userTimezone}</div>
          </div>
          <div className="mt-2 space-y-2">
            {timesForSelectedDay.length === 0 && (
              <span className="text-xs text-black/60 dark:text-white/60">Sin turnos para ese día</span>
            )}
            {selectedModality === "Online" && prof.modalities.includes("Online") && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-1 text-[10px] text-blue-700 dark:text-blue-300">
                  <span className="h-2 w-2 rounded-full bg-blue-500" /> Online
                </span>
                {timesForSelectedDay.map((t) => (
                  <Button
                    key={`on-${t}`}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTime(t);
                    }}
                    className={
                      (selectedTime === t && selectedModality === "Online")
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-300"
                    }
                  >
                    {t}
                  </Button>
                ))}
              </div>
            )}
            {selectedModality === "Presencial" && prof.modalities.includes("Presencial") && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Presencial
                </span>
                {timesForSelectedDay.map((t) => (
                  <Button
                    key={`pr-${t}`}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedTime(t);
                    }}
                    className={
                      (selectedTime === t && selectedModality === "Presencial")
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                    }
                  >
                    {t}
                  </Button>
                ))}
              </div>
            )}
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
    <Dialog open={openConfirm} onOpenChange={setOpenConfirm}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserva confirmada</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {confirmation}
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpenConfirm(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    </div>

  );
}


