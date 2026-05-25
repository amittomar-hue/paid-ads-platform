"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_AUTOMATIONS, ACTIVITY_LOG } from "@/lib/mock-data";
import type { AutomationRule } from "@/lib/types";
import { Zap, Activity, Clock, Settings, List } from "lucide-react";

const CATEGORIES = ["All", "Quality Control", "Budget Control", "Bid Strategy", "Audience Management", "Scheduling"];
const MAIN_TABS = ["Workflow Library", "Activity Log"];

export default function AutomationPage() {
  const [rules, setRules] = useState<AutomationRule[]>(MOCK_AUTOMATIONS);
  const [category, setCategory] = useState("All");
  const [platformFilter, setPlatformFilter] = useState<"all" | "google" | "linkedin" | "both">("all");
  const [mainTab, setMainTab] = useState("Workflow Library");

  function toggle(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  }

  const filtered = rules.filter((r) => {
    if (category !== "All" && r.category !== category) return false;
    if (platformFilter !== "all" && r.platform !== platformFilter) return false;
    return true;
  });

  const activeCount = rules.filter((r) => r.enabled).length;
  const totalExecutions = rules.reduce((s, r) => s + r.executions, 0);

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Automation Workflows" subtitle="Autonomous rule-based optimization engine" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Main Tabs */}
        <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
          {MAIN_TABS.map((t) => (
            <button key={t} onClick={() => setMainTab(t)}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${mainTab === t ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
              {t === "Activity Log" ? <List size={12} /> : <Zap size={12} />}
              {t}
            </button>
          ))}
        </div>

        {mainTab === "Activity Log" && (
          <Card>
            <CardHeader title="Automation Activity Log" subtitle="Chronological feed of all automated changes" />
            <div className="space-y-2">
              {ACTIVITY_LOG.map((log) => (
                <div key={log.id} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <code className="text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">{log.rule.split(" ")[0]}</code>
                      <p className="text-xs font-medium text-slate-900">{log.rule.substring(log.rule.indexOf(" ") + 1)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <PlatformBadge platform={log.platform as "google" | "linkedin"} />
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${log.impact === "High" ? "bg-red-500/15 text-red-400" : log.impact === "Medium" ? "bg-amber-500/15 text-amber-400" : "bg-slate-500/15 text-slate-400"}`}>{log.impact}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">Trigger</p>
                      <p className="text-slate-400">{log.trigger}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">Action Taken</p>
                      <p className="text-slate-700">{log.action}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 mb-0.5">Outcome (24h)</p>
                      <p className="text-emerald-400">{log.outcome}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                    <Clock size={9} /> {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {mainTab === "Workflow Library" && (<>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Rules", value: String(activeCount), icon: Zap, color: "#10b981" },
            { label: "Total Rules", value: String(rules.length), icon: Settings, color: "#4285f4" },
            { label: "Total Executions", value: totalExecutions.toLocaleString(), icon: Activity, color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}20` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${category === c ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
                  {c}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {(["all", "google", "linkedin", "both"] as const).map((p) => (
                <button key={p} onClick={() => setPlatformFilter(p)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${platformFilter === p ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((rule) => (
            <Card key={rule.id} className={`transition-colors ${rule.enabled ? "" : "opacity-60"}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${rule.enabled ? "bg-emerald-500/20" : "bg-slate-100"}`}>
                  <Zap size={14} className={rule.enabled ? "text-emerald-400" : "text-slate-500"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900">{rule.name}</p>
                    <button
                      onClick={() => toggle(rule.id)}
                      className={`flex-shrink-0 w-8 h-4 rounded-full transition-colors relative ${rule.enabled ? "bg-emerald-500" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${rule.enabled ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{rule.description}</p>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-slate-500 w-14 flex-shrink-0">Trigger:</span>
                      <code className="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px]">{rule.trigger}</code>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="text-slate-500 w-14 flex-shrink-0">Action:</span>
                      <span className="text-slate-700">{rule.action}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {rule.platform === "both" ? (
                      <>
                        <PlatformBadge platform="google" />
                        <PlatformBadge platform="linkedin" />
                      </>
                    ) : (
                      <PlatformBadge platform={rule.platform} />
                    )}
                    <span className="text-[10px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded">{rule.category}</span>
                    <span className="ml-auto flex items-center gap-1 text-[10px] text-slate-500">
                      <Activity size={10} />
                      {rule.executions} runs
                    </span>
                  </div>

                  {rule.last_triggered && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-500">
                      <Clock size={9} />
                      Last triggered: {new Date(rule.last_triggered).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-500 text-sm">No rules match your filters.</div>
          )}
        </div>

        {/* Add Rule CTA */}
        <Card className="border-dashed border-slate-200 bg-transparent flex items-center justify-center p-8 text-center">
          <div>
            <Zap size={24} className="text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-3">Create a custom automation rule</p>
            <Button variant="outline" size="sm">
              <Settings size={13} /> New Rule
            </Button>
          </div>
        </Card>
        </>)}
      </div>
    </div>
  );
}
