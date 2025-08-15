"use client";
import { useMemo, useState } from "react";
import data from "@/data/psychologists.json";
import { AvailabilitySlot, WeeklyAvailability, generateSlotsFromWeekly, groupSlotsByDateAndModality } from "@/lib/availability";
import Filters from "@/components/Filters";
import PsychologistCard from "../components/PsychologistCard";

type Psychologist = {
  id: string;
  name: string;
  image: string;
  specialties: string[];
  modalities: Array<"Online" | "Presencial">;
  rating?: number;
  limited?: boolean;
  experienceYears: number;
  sessionMinutes: number;
  priceUSD: number;
  bio: string;
  weeklyAvailability?: WeeklyAvailability;
  slots?: AvailabilitySlot[];
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [modalities, setModalities] = useState<Array<"Online" | "Presencial">>([]);
  const [limitedOnly, setLimitedOnly] = useState(false);
  const psychologists = data as unknown as Psychologist[];

  const LIMITED_SLOTS_THRESHOLD = 5; // based on next-90-days free slots across all modalities

  const results = useMemo(() => {
    const s = search.trim().toLowerCase();
    const from = new Date();
    const to = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
    return psychologists.filter((p) => {
      const matchesSearch = s
        ? p.name.toLowerCase().includes(s) || p.specialties.some((x) => x.toLowerCase().includes(s))
        : true;
      const matchesCategories = categories.length > 0 ? categories.every((c) => p.specialties.includes(c)) : true;
      const matchesModalities = modalities.length > 0 ? modalities.some((m) => p.modalities.includes(m)) : true;
      const slots = (p.slots ?? generateSlotsFromWeekly(p.weeklyAvailability, p.id, from, to));
      const grouped = groupSlotsByDateAndModality(slots);
      const totalFor = (rec: Record<string, unknown[]>) => Object.values(rec).reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
      const selectedCount = modalities.length === 0
        ? totalFor(grouped.online) + totalFor(grouped.presencial)
        : modalities.reduce((sum, m) => sum + totalFor(m === "Online" ? grouped.online : grouped.presencial), 0);
      const matchesLimited = limitedOnly ? (selectedCount <= LIMITED_SLOTS_THRESHOLD) : true;
      return matchesSearch && matchesCategories && matchesModalities && matchesLimited;
    });
  }, [search, categories, modalities, limitedOnly, psychologists]);

  function toggleCategory(category: string) {
    setCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
  }

  function toggleModality(modality: "Online" | "Presencial") {
    setModalities((prev) => (prev.includes(modality) ? prev.filter((m) => m !== modality) : [...prev, modality]));
  }

  return (
    <main className="w-full">
      {/* Hero full-width with inner container */}
      <header className="w-full bg-amber-300 py-10 text-center text-black dark:text-black">
        <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-lg font-semibold">Encuentra tu psicólogo ideal</h1>
        <p className="mt-2 text-sm opacity-80">Conecta con profesionales de la salud mental certificados. Tu bienestar emocional es nuestra prioridad.</p>
        <div className="mt-4">
          <a href="#list" className="inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white">Ver Psicólogos</a>
        </div>
        </div>
      </header>

      {/* Search + list section */}
      <section className="mx-auto mt-6 w-full max-w-6xl px-4" id="list">
        <Filters
          onSearchChange={setSearch}
          onCategoryToggle={toggleCategory}
          onModalityToggle={toggleModality}
          activeModalities={modalities}
          limitedOnly={limitedOnly}
          onToggleLimited={() => setLimitedOnly((v) => !v)}
          activeCategories={categories}
          search={search}
        />

        <div className="mt-6">
          <h2 className="text-base font-semibold">Psicólogos disponibles</h2>
          <p className="mt-1 text-xs text-black/60 dark:text-white/60">{results.length} profesionales encontrados</p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => {
            const from = new Date();
            const to = new Date(Date.now() + 1000 * 60 * 60 * 24 * 90);
            const slots = (p.slots ?? generateSlotsFromWeekly(p.weeklyAvailability, p.id, from, to));
            const grouped = groupSlotsByDateAndModality(slots);
            const totalFor = (rec: Record<string, unknown[]>) => Object.values(rec).reduce((acc, arr) => acc + (arr?.length ?? 0), 0);
            const selectedCount = modalities.length === 0
              ? totalFor(grouped.online) + totalFor(grouped.presencial)
              : modalities.reduce((sum, m) => sum + totalFor(m === "Online" ? grouped.online : grouped.presencial), 0);
            const limitedFlag = selectedCount <= LIMITED_SLOTS_THRESHOLD;
            return <PsychologistCard key={p.id} data={{ ...p, limited: limitedFlag }} />;
          })}
        </div>
      </section>

      {/* Footer full-width with inner padding */}
      <footer id="contacto" className="mt-10 w-full bg-black/5 py-8 text-center text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
        <div className="mx-auto max-w-6xl px-4">Footer</div>
      </footer>
    </main>
  );
}
