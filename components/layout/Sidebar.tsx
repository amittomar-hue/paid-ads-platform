"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <aside className="w-56 flex-shrink-0 bg-[#111116] border-r border-white/6 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">AdMind</p>
            <p className="text-[10px] text-slate-500 mt-0.5">AI Ads Platform</p>
          </div>
        </div>
      </div>

      {/* Platform indicators */}
      <div className="px-5 py-3 border-b border-white/6">
        <p className="text-[10px] font-medium text-slate-500 mb-2 uppercase tracking-wider">Connected</p>
        <div className="flex flex-col gap-1.5">
          {[
            { label: "Google Ads", color: "#4285f4" },
            { label: "LinkedIn Ads", color: "#0077b5" },
          ].map((p) => (
            <div key={p.label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: p.color }} />
              <span className="text-xs text-slate-400">{p.label}</span>
              <span className="ml-auto text-[10px] text-emerald-400 font-medium">Live</span>
            </div>
          ))}
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
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              <Icon size={14} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 flex items-center justify-center">
            <span className="text-[10px] font-bold text-blue-400">AI</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate">Claude claude-sonnet-4-6</p>
            <p className="text-[10px] text-emerald-400">Active</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
