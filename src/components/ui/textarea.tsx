import { TextareaHTMLAttributes, forwardRef } from "react";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={("w-full rounded-md border border-black/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-black/30 dark:border-white/20 dark:focus:border-white/40 " + (className ?? "")).trim()}
      {...props}
    />
  );
});


