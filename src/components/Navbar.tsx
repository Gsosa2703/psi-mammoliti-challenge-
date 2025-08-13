"use client";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 w-full border-b border-black/10 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-black/70">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-3 sm:px-4">
        <a href="#" className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs font-medium text-black dark:border-white/10 dark:bg-white/10 dark:text-white">
          Psi Sesiones
        </a>
        <div className="hidden gap-6 text-sm text-black/80 dark:text-white/80 sm:flex">
          <a href="#como-funciona" className="hover:opacity-100 opacity-80">Como funciona</a>
          <a href="#contacto" className="hover:opacity-100 opacity-80">Contacto</a>
        </div>
        <a href="#mis-sesiones" className="rounded-full bg-[#c8a6ff] px-4 py-2 text-xs font-semibold text-black shadow-sm">
          Mis sesiones
        </a>
      </div>
    </nav>
  );
}


