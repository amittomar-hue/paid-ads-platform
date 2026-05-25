import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  rows?: number;
}

const inputBase =
  "w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors";

export function Input({ label, hint, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      <input className={cn(inputBase, error && "border-red-500/50", className)} {...props} />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, hint, error, rows = 3, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      <textarea
        rows={rows}
        className={cn(inputBase, "resize-none", error && "border-red-500/50", className)}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, hint, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-400">{label}</label>}
      <select
        className={cn(
          inputBase,
          "appearance-none bg-white cursor-pointer",
          className
        )}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-white">
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
