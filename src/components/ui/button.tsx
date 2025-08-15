import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type ButtonPropsBase = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
};

type Props = ButtonPropsBase & { asChild?: boolean };

export function Button({ className, variant = "default", size = "md", asChild, ...props }: Props) {
  const base = "inline-flex cursor-pointer items-center justify-center rounded-md font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-black text-white dark:bg-white dark:text-black hover:opacity-90",
    outline: "border border-black/15 bg-transparent text-black hover:border-black/30 dark:border-white/20 dark:text-white",
    ghost: "bg-transparent hover:bg-black/5 dark:hover:bg-white/10"
  } as const;
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-base"
  } as const;
  if (asChild) {
    // Consumers can use asChild with Next Link by passing children=<Link/>.
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <span className={cn(base, variants[variant], sizes[size], className)}>{(props as any).children}</span>
    );
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}


