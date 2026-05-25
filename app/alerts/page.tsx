"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_ALERTS } from "@/lib/mock-data";
import type { AnomalyAlert } from "@/lib/types";
import { AlertTriangle, CheckCircle, Bell, TrendingUp, TrendingDown, DollarSign, Star } from "lucide-react";
import { severityColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(MOCK_ALERTS);

  function resolve(id: string) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, resolved: true } : a));
  }

  const active = alerts.filter((a) => !a.resolved);
  const resolved = alerts.filter((a) => a.resolved);

  const typeIcon = (type: string) => {
    if (type === "spike") return <TrendingUp size={14} className="text-blue-400" />;
    if (type === "drop") return <TrendingDown size={14} className="text-red-400" />;
    if (type === "budget") return <DollarSign size={14} className="text-amber-400" />;
    return <Star size={14} className="text-purple-400" />;
  };

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Anomaly Alerts" subtitle="Real-time performance monitoring and intelligent alerts" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Alerts", value: active.length, color: active.length > 0 ? "#ef4444" : "#10b981" },
            { label: "Critical", value: active.filter((a) => a.severity === "critical").length, color: "#ef4444" },
            { label: "Resolved (24h)", value: resolved.length, color: "#10b981" },
          ].map((s) => (
            <div key={s.label} className="bg-[#1c1c24] border border-white/8 rounded-xl p-4">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active Alerts */}
        {active.length > 0 && (
          <Card>
            <CardHeader title="Active Alerts" subtitle={`${active.length} unresolved`} />
            <div className="space-y-3">
              {active.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "p-4 rounded-xl border",
                    alert.severity === "critical" ? "bg-red-500/8 border-red-500/25" :
                    alert.severity === "warning" ? "bg-amber-500/8 border-amber-500/25" :
                    "bg-blue-500/8 border-blue-500/25"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5">{typeIcon(alert.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-white">{alert.campaign_name}</p>
                          <span className={cn(
                            "text-[10px] font-medium px-1.5 py-0.5 rounded",
                            alert.severity === "critical" ? "bg-red-500/20 text-red-400" :
                            alert.severity === "warning" ? "bg-amber-500/20 text-amber-400" :
                            "bg-blue-500/20 text-blue-400"
                          )}>
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-2">
                          <PlatformBadge platform={alert.platform} />
                          <span className="text-[10px] text-slate-500">Metric: {alert.metric}</span>
                          <span className="text-[10px] text-slate-500">·</span>
                          <span className="text-[10px] text-slate-500">{new Date(alert.detected_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => resolve(alert.id)}>
                      <CheckCircle size={13} /> Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {active.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle size={32} className="text-emerald-400 mb-3" />
            <p className="text-sm text-white font-medium">All clear!</p>
            <p className="text-xs text-slate-500 mt-1">No active alerts — all campaigns performing within expected ranges</p>
          </Card>
        )}

        {/* Resolved */}
        {resolved.length > 0 && (
          <Card>
            <CardHeader title="Resolved Alerts" subtitle={`${resolved.length} resolved`} />
            <div className="space-y-2">
              {resolved.map((alert) => (
                <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/3 border border-white/6 opacity-60">
                  <CheckCircle size={13} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{alert.campaign_name} — {alert.metric}</p>
                    <p className="text-[11px] text-slate-500">{alert.description}</p>
                  </div>
                  <PlatformBadge platform={alert.platform} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
