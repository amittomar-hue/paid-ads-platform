import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantMap = {
  primary: "bg-blue-600 hover:bg-blue-500 text-slate-900 border-transparent",
  outline: "bg-transparent hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300",
  ghost: "bg-transparent hover:bg-slate-100 text-slate-400 hover:text-slate-700 border-transparent",
  danger: "bg-red-600 hover:bg-red-500 text-slate-900 border-transparent",
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
