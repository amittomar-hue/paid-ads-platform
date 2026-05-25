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
  ChevronDown,
  Loader2,
  CheckCircle,
  X,
  Link2,
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

const PLATFORMS = [
  { key: "google" as const, label: "Google Ads", color: "#4285f4", placeholder: "AIzaSy... or Developer Token" },
  { key: "linkedin" as const, label: "LinkedIn Ads", color: "#0077b5", placeholder: "LinkedIn Access Token" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [connected, setConnected] = useState({ google: false, linkedin: false });
  const [expanded, setExpanded] = useState<"google" | "linkedin" | null>(null);
  const [keys, setKeys] = useState({ google: "", linkedin: "" });
  const [loading, setLoading] = useState<"google" | "linkedin" | null>(null);
  const [flash, setFlash] = useState<{ platform: string; ok: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/status").then((r) => r.json()).then(setConnected).catch(() => {});
  }, []);

  async function connect(platform: "google" | "linkedin") {
    const key = keys[platform].trim();
    if (!key) return;
    setLoading(platform);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, key }),
      });
      if (res.ok) {
        setConnected((prev) => ({ ...prev, [platform]: true }));
        setKeys((prev) => ({ ...prev, [platform]: "" }));
        setExpanded(null);
        setFlash({ platform, ok: true });
        setTimeout(() => setFlash(null), 3000);
      } else {
        setFlash({ platform, ok: false });
        setTimeout(() => setFlash(null), 3000);
      }
    } catch {
      setFlash({ platform, ok: false });
      setTimeout(() => setFlash(null), 3000);
    } finally {
      setLoading(null);
    }
  }

  async function disconnect(platform: "google" | "linkedin") {
    await fetch("/api/connect", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platform }),
    });
    setConnected((prev) => ({ ...prev, [platform]: false }));
    setExpanded(null);
  }

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

      {/* Platform connectors */}
      <div className="px-4 py-3 border-b border-slate-200">
        <p className="text-[10px] font-medium text-slate-400 mb-2 uppercase tracking-wider">Platforms</p>
        <div className="flex flex-col gap-1">
          {PLATFORMS.map((p) => {
            const isLive = connected[p.key];
            const isExpanded = expanded === p.key;
            const isLoading = loading === p.key;
            const didFlash = flash?.platform === p.key;

            return (
              <div key={p.key}>
                <div className="flex items-center gap-2 py-1">
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", isLive && "animate-pulse")}
                    style={{ background: isLive ? p.color : "#cbd5e1" }}
                  />
                  <span className="text-xs text-slate-500 flex-1">{p.label}</span>

                  {isLive ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-500 font-medium">Live</span>
                      <button
                        onClick={() => disconnect(p.key)}
                        className="text-slate-300 hover:text-red-400 transition-colors"
                        title="Disconnect"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setExpanded(isExpanded ? null : p.key)}
                      className="flex items-center gap-0.5 text-[10px] text-blue-500 hover:text-blue-600 font-medium transition-colors"
                    >
                      <Link2 size={9} />
                      Connect
                      <ChevronDown size={9} className={cn("transition-transform", isExpanded && "rotate-180")} />
                    </button>
                  )}
                </div>

                {/* Inline connect form */}
                {isExpanded && !isLive && (
                  <div className="ml-3.5 mb-2 space-y-1.5">
                    <input
                      value={keys[p.key]}
                      onChange={(e) => setKeys((prev) => ({ ...prev, [p.key]: e.target.value }))}
                      placeholder={p.placeholder}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-[10px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400"
                      onKeyDown={(e) => e.key === "Enter" && connect(p.key)}
                      autoFocus
                    />
                    <button
                      onClick={() => connect(p.key)}
                      disabled={isLoading || !keys[p.key].trim()}
                      className="w-full flex items-center justify-center gap-1 py-1.5 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <><Loader2 size={9} className="animate-spin" /> Connecting…</>
                      ) : (
                        <><CheckCircle size={9} /> Save & Connect</>
                      )}
                    </button>
                    {didFlash && !flash?.ok && (
                      <p className="text-[9px] text-red-400">Connection failed. Check your key.</p>
                    )}
                  </div>
                )}

                {didFlash && flash?.ok && (
                  <p className="ml-3.5 text-[9px] text-emerald-500 mb-1">Connected successfully!</p>
                )}
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
