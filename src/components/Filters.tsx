"use client";
import { useEffect, useMemo, useState } from "react";
import categoriesJson from "@/data/categories.json";

type FiltersProps = {
  onSearchChange: (value: string) => void;
  onCategoryToggle: (category: string) => void;
  onModalityToggle?: (modality: "Online" | "Presencial") => void;
  activeModalities?: Array<"Online" | "Presencial">;
  limitedOnly?: boolean;
  onToggleLimited?: () => void;
  activeCategories: string[];
  search: string;
};

export default function Filters(props: FiltersProps) {
  const { onSearchChange, onCategoryToggle, activeCategories, search, onModalityToggle, activeModalities = [], limitedOnly = false, onToggleLimited } = props;
  const [query, setQuery] = useState(search);

  useEffect(() => setQuery(search), [search]);

  const categories = useMemo(() => categoriesJson, []);

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-black">
      <div className="flex items-center gap-3">
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchChange(query);
            }}
            placeholder="Buscar por nombre o especialidad..."
            className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
          />
        </div>
        <button
          onClick={() => onSearchChange(query)}
          className="shrink-0 cursor-pointer rounded-xl bg-black px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Buscar
        </button>
      </div>

      {/* Modality */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <span className="text-black/80 dark:text-white/80">Modalidad</span>
        </div>
        <div className="flex gap-2">
          {["Online", "Presencial"].map((m) => {
            const typed = m as "Online" | "Presencial";
            const active = activeModalities.includes(typed);
            return (
              <button
                key={m}
                onClick={() => onModalityToggle?.(typed)}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs transition " +
                  (active
                    ? (m === "Online"
                        ? "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300")
                    : "border-black/15 text-black/80 hover:border-black/30 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40")
                }
              >
                <span className={m === "Online" ? "h-2 w-2 rounded-full bg-blue-500" : "h-2 w-2 rounded-full bg-emerald-500"} />
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability toggle */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
          <span className="text-black/80 dark:text-white/80">Poca disponibilidad</span>
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input type="checkbox" checked={limitedOnly} onChange={onToggleLimited} className="peer hidden" />
            <span className="relative inline-flex h-5 w-9 cursor-pointer items-center rounded-full bg-black/15 transition peer-checked:bg-red-500">
              <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white transition peer-checked:left-4" />
            </span>
          </label>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-black/60 dark:text-white/60">Especialidades</span>
        {categories.map((category) => {
          const active = activeCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={
                "flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1 text-xs transition " +
                (active
                  ? "border-violet-500 bg-violet-500/10 text-violet-700 dark:text-violet-300"
                  : "border-black/15 text-black/80 hover:border-black/30 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40")
              }
            >
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}


