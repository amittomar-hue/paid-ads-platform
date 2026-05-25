import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantMap = {
  primary: "bg-blue-600 hover:bg-blue-500 text-white border-transparent",
  outline: "bg-transparent hover:bg-white/5 text-slate-300 border-white/15 hover:border-white/25",
  ghost: "bg-transparent hover:bg-white/5 text-slate-400 hover:text-slate-300 border-transparent",
  danger: "bg-red-600 hover:bg-red-500 text-white border-transparent",
};

const sizeMap = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-sm",
};

export function Button({ variant = "outline", size = "md", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 font-medium rounded-lg border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantMap[variant],
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
