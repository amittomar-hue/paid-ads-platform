import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}

const variantMap = {
  default: "bg-slate-500/20 text-slate-300 ring-1 ring-slate-500/30",
  success: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
  warning: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30",
  danger: "bg-red-500/20 text-red-400 ring-1 ring-red-500/30",
  info: "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30",
  muted: "bg-white/5 text-slate-400 ring-1 ring-white/10",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium", variantMap[variant], className)}>
      {children}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: string }) {
  const isGoogle = platform === "google";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold",
        isGoogle
          ? "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/25"
          : "bg-sky-600/15 text-sky-400 ring-1 ring-sky-500/25"
      )}
    >
      <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold"
        style={{ background: isGoogle ? "#4285f4" : "#0077b5" }}>
        {isGoogle ? "G" : "in"}
      </span>
      {isGoogle ? "Google Ads" : "LinkedIn Ads"}
    </span>
  );
}
