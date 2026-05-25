import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (compact && value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, compact = false): string {
  if (compact && value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (compact && value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function platformColor(platform: string): string {
  return platform === "google" ? "#4285f4" : "#0077b5";
}

export function platformLabel(platform: string): string {
  return platform === "google" ? "Google Ads" : "LinkedIn Ads";
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    Active: "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30",
    Paused: "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30",
    Draft: "bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30",
    Ended: "bg-red-500/20 text-red-400 ring-1 ring-red-500/30",
  };
  return map[status] ?? map["Draft"];
}

export function riskColor(risk: string): string {
  const map: Record<string, string> = {
    LOW: "text-emerald-400",
    MEDIUM: "text-amber-400",
    HIGH: "text-orange-400",
    CRITICAL: "text-red-400",
  };
  return map[risk] ?? "text-slate-400";
}

export function severityColor(severity: string): string {
  const map: Record<string, string> = {
    critical: "bg-red-500/15 border-red-500/30 text-red-400",
    warning: "bg-amber-500/15 border-amber-500/30 text-amber-400",
    info: "bg-blue-500/15 border-blue-500/30 text-blue-400",
  };
  return map[severity] ?? map["info"];
}
