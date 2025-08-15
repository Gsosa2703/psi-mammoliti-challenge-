"use client";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      {children}
    </div>,
    document.body
  );
}

type DialogContentProps = {
  className?: string;
  children: ReactNode;
};

export function DialogContent({ className, children }: DialogContentProps) {
  return (
    <div className={cn("relative z-10 w-[95vw] max-w-md rounded-2xl border border-black/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-black", className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="mb-2">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <div className="text-base font-semibold">{children}</div>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <div className="mt-1 text-sm text-black/70 dark:text-white/70">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="mt-4 flex items-center justify-end gap-2">{children}</div>;
}


