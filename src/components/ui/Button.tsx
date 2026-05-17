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
  const base = "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";
  const styles = {
    primary: "bg-primary text-white hover:bg-[#24450f]",
    secondary: "bg-cream text-primary border border-primary hover:bg-[#eef1e7]",
    ghost: "bg-transparent text-primary hover:bg-[#eaf1e3]",
    danger: "bg-danger text-white hover:bg-[#a92222]"
  };

  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
    </button>
  );
}
