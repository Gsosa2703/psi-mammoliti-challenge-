"use client";
import { useMemo, useState } from "react";
import Filters from "@/components/Filters";
import ProfileModal from "@/components/ProfileModal";

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

export default function Home() {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selected, setSelected] = useState<Psychologist | null>(null);


  function toggleCategory(category: string) {
    setCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]));
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
          activeCategories={categories}
          search={search}
        />

        <div className="mt-6">
          <h2 className="text-base font-semibold">Psicólogos disponibles</h2>
        </div>

      </section>

      {/* Footer full-width with inner padding */}
      <footer id="contacto" className="mt-10 w-full bg-black/5 py-8 text-center text-sm text-black/60 dark:bg-white/10 dark:text-white/60">
        <div className="mx-auto max-w-6xl px-4">Footer</div>
      </footer>

      <ProfileModal open={!!selected} data={selected} onClose={() => setSelected(null)} />
    </main>
  );
}
