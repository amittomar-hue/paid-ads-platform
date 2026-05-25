"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Megaphone,
  Sparkles,
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Settings,
  TrendingUp,
  AlertTriangle,
  Search,
  FlaskConical,
  FileText,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/optimize", label: "Optimize", icon: TrendingUp },
  { href: "/creative", label: "Creative Engine", icon: Sparkles },
  { href: "/audience", label: "Audience Builder", icon: Users },
  { href: "/budget", label: "Budget Intel", icon: DollarSign },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/keywords", label: "Keywords", icon: Search },
  { href: "/tests", label: "A/B Tests", icon: FlaskConical },
  { href: "/automation", label: "Automation", icon: Zap },
  { href: "/alerts", label: "Alerts", icon: AlertTriangle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [connected, setConnected] = useState({ google: false, linkedin: false });

  useEffect(() => {
    fetch("/api/status").then((r) => r.json()).then(setConnected).catch(() => {});
  }, []);

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles size={14} className="text-slate-900" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 leading-none">AdMind</p>
            <p className="text-[10px] text-slate-500 mt-0.5">AI Ads Platform</p>
          </div>
        </div>
      </div>

      {/* Platform indicators */}
      <div className="px-5 py-3 border-b border-slate-200">
        <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-wider">Platforms</p>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "Google Ads", color: "#4285f4", key: "google" as const },
            { label: "LinkedIn Ads", color: "#0077b5", key: "linkedin" as const },
          ].map((p) => {
            const isLive = connected[p.key];
            return (
              <div key={p.label} className="flex items-center gap-2">
                <span
                  className={cn("w-1.5 h-1.5 rounded-full", isLive && "animate-pulse")}
                  style={{ background: isLive ? p.color : "#94a3b8" }}
                />
                <span className="text-xs text-slate-400">{p.label}</span>
                <span className={cn("ml-auto text-[10px] font-medium", isLive ? "text-emerald-400" : "text-slate-400")}>
                  {isLive ? "Live" : "Not set"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 mx-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-blue-400">AI</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-700 truncate">Claude claude-sonnet-4-6</p>
            <p className="text-[10px] text-emerald-400">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
