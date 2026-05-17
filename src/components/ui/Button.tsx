import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}) {
  const base = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
  const styles = {
    primary: "bg-primary text-white shadow-sm hover:bg-[#27480f]",
    secondary: "bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
    danger: "bg-danger text-white shadow-sm hover:bg-[#a32222]"
  };

  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
