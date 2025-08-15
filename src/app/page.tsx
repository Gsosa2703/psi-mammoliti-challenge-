"use client";
import { useMemo, useState } from "react";
import data from "@/data/psychologists.json";
import Filters from "@/components/Filters";
import PsychologistCard from "../components/PsychologistCard";

type WeeklyAvailability = {
  online: {
    mon: string[];
    tue: string[];
    wed: string[];
    thu: string[];
    fri: string[];
    sat: string[];
    sun: string[];
  };
  presencial: {
    mon: string[];
    tue: string[];
    wed: string[];
    thu: string[];
    fri: string[];
    sat: string[];
    sun: string[];
  };
};

// Intentionally no standalone DaysKey export to avoid unused warnings

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
  weeklyAvailability: WeeklyAvailability;
};

export default function Home() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [modalities, setModalities] = useState<Array<"Online" | "Presencial">>([]);
  const [limitedOnly, setLimitedOnly] = useState(false);
  const psychologists = data as unknown as Psychologist[];

  const LIMITED_THRESHOLD = 10; // tweakable

  const results = useMemo(() => {
    const s = search.trim().toLowerCase();
    const days = ["mon","tue","wed","thu","fri","sat","sun"] as const;
    const countFor = (bucket: Record<typeof days[number], string[]>) => days.reduce((acc, d) => acc + (bucket[d]?.length ?? 0), 0);
    return psychologists.filter((p) => {
      const matchesSearch = s
        ? p.name.toLowerCase().includes(s) || p.specialties.some((x) => x.toLowerCase().includes(s))
        : true;
      const matchesCategories = categories.length > 0 ? categories.every((c) => p.specialties.includes(c)) : true;
      const matchesModalities = modalities.length > 0 ? modalities.some((m) => p.modalities.includes(m)) : true;
      const matchesLimited = limitedOnly
        ? (p.limited === true
            ? true
            : (modalities.length === 1
                ? countFor(p.weeklyAvailability[modalities[0] === "Online" ? "online" : "presencial"]) <= LIMITED_THRESHOLD
                : (countFor(p.weeklyAvailability.online) + countFor(p.weeklyAvailability.presencial)) <= LIMITED_THRESHOLD))
        : true;
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
          {results.map((p) => (
            <PsychologistCard key={p.id} data={{ ...p }} />
          ))}
        </div>
      </section>

      {/* Footer full-width with inner padding */}
      <footer id="contacto" className="mt-10 w-full bg-black/5 py-8 text-center text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
        <div className="mx-auto max-w-6xl px-4">Footer</div>
      </footer>
    </main>
  );
}
