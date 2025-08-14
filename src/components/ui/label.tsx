import { LabelHTMLAttributes } from "react";

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } = props;
  return <label className={("text-xs font-medium text-black/80 dark:text-white/80 " + (className ?? "")).trim()} {...rest} />;
}


