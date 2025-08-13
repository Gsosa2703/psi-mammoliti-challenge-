type Psychologist = {
 id: string;
 name: string;
 image: string;
 specialties: string[];
 experienceYears: number;
 sessionMinutes: number;
 priceUSD: number;
};

type CardProps = {
 data: Psychologist;
 onOpen: () => void;
};

export default function PsychologistCard({ data, onOpen }: CardProps) {
 return (
   <div className="rounded-2xl border border-black/10 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-black">
     <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-black/5 dark:bg-white/10">
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={data.image} alt={data.name} className="h-full w-full object-cover" />
     </div>
     <div className="mt-3">
       <div className="flex items-center justify-between gap-2">
         <h3 className="text-sm font-semibold leading-none">{data.name}</h3>
         <span className="text-xs text-black/60 dark:text-white/60">{data.experienceYears}+ años</span>
       </div>
       <div className="mt-2 flex flex-wrap gap-1">
         {data.specialties.slice(0, 3).map((s) => (
           <span key={s} className="rounded-md border border-black/10 px-2 py-1 text-[10px] text-black/70 dark:border-white/20 dark:text-white/70">
             {s}
           </span>
         ))}
       </div>
       <div className="mt-3 flex items-center justify-between text-sm">
         <span className="text-black/70 dark:text-white/70">{data.sessionMinutes} min</span>
         <span className="font-semibold">USD {data.priceUSD}</span>
       </div>
       <button
         onClick={onOpen}
         className="mt-3 w-full rounded-xl bg-black px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black"
       >
         Ver perfil
       </button>
     </div>
   </div>
 );
}


