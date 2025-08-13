"use client";
import { useEffect, useMemo, useState } from "react";
import categoriesJson from "@/data/categories.json";

type FiltersProps = {
  onSearchChange: (value: string) => void;
  onCategoryToggle: (category: string) => void;
  activeCategories: string[];
  search: string;
};

export default function Filters(props: FiltersProps) {
  const { onSearchChange, onCategoryToggle, activeCategories, search } = props;
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
          className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-black"
        >
          Buscar
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-xs text-black/60 dark:text-white/60">Especialidad</span>
        {categories.map((category) => {
          const active = activeCategories.includes(category);
          return (
            <button
              key={category}
              onClick={() => onCategoryToggle(category)}
              className={
                "rounded-md border px-2 py-1 text-xs transition " +
                (active
                  ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                  : "border-black/15 text-black/80 hover:border-black/30 dark:border-white/20 dark:text-white/80 dark:hover:border-white/40")
              }
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}


