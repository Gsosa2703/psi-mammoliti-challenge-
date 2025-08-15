import Link from "next/link";
import { Button } from "@/components/ui/button";

type Psychologist = {
	id: string;
	name: string;
	image: string;
	specialties: string[];
	modalities?: Array<"Online" | "Presencial">;
	experienceYears: number;
	sessionMinutes: number;
	priceUSD: number;
};

type CardProps = {
	data: Psychologist;
};

export default function PsychologistCard({ data }: CardProps) {
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
				{data.modalities && data.modalities.length > 0 ? (
					<div className="mt-2 flex flex-wrap gap-2">
						{data.modalities.includes("Online") && (
							<Button
								variant="outline"
								size="sm"
								className="rounded-full border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-400/40 dark:bg-blue-500/10 dark:text-blue-300"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
									<path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25v8.25A2.25 2.25 0 0 1 18.75 15H5.25A2.25 2.25 0 0 1 3 13.5V5.25z"/>
									<path d="M6 18.75A.75.75 0 0 1 6.75 18h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 18.75z"/>
								</svg>
								<span className="ml-1">Online</span>
							</Button>
						)}
						{data.modalities.includes("Presencial") && (
							<Button
								variant="outline"
								size="sm"
								className="rounded-full border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-300"
							>
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
									<path fillRule="evenodd" d="M12 2.25c-4.28 0-7.75 3.47-7.75 7.75 0 4.12 3.19 8.48 6.33 10.96.85.67 1.99.67 2.84 0 3.14-2.48 6.33-6.84 6.33-10.96 0-4.28-3.47-7.75-7.75-7.75zm0 10.25a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" clipRule="evenodd"/>
								</svg>
								<span className="ml-1">Presencial</span>
							</Button>
						)}
					</div>
				) : null}
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
				<Link href={`/profesionales/${data.id}`} className="mt-3 block w-full rounded-xl bg-black px-4 py-2 text-center text-sm font-medium text-white dark:bg-white dark:text-black">
					Ver perfil
				</Link>
			</div>
		</div>
	);
}


