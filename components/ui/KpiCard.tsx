import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  icon?: LucideIcon;
  iconColor?: string;
  sub?: string;
}

export function KpiCard({ label, value, change, changePositive, icon: Icon, iconColor, sub }: KpiCardProps) {
  return (
    <div className="bg-[#1c1c24] border border-white/8 rounded-xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
          {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
          {change && (
            <p className={cn("text-xs mt-1.5 font-medium", changePositive ? "text-emerald-400" : "text-red-400")}>
              {changePositive ? "↑" : "↓"} {change} vs last period
            </p>
          )}
        </div>
        {Icon && (
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: iconColor ? `${iconColor}20` : "rgba(255,255,255,0.06)" }}
          >
            <Icon size={16} style={{ color: iconColor ?? "#94a3b8" }} />
          </div>
        )}
      </div>
    </div>
  );
}
