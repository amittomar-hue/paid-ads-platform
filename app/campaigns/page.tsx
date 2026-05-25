"use client";

import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { Badge, PlatformBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPct, statusColor } from "@/lib/utils";
import { Plus, Search, Filter, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CampaignsPage() {
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "google" | "linkedin">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Campaigns"
        subtitle={`${MOCK_CAMPAIGNS.length} total Â· ${MOCK_CAMPAIGNS.filter((c) => c.status === "Active").length} active`}
        action={
          <Link href="/campaigns/create">
            <Button variant="primary" size="sm">
              <Plus size={13} /> New Campaign
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">
        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search campaigns..."
                className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/60"
              />
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {(["all", "google", "linkedin"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatformFilter(p)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    platformFilter === p ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {p === "all" ? "All Platforms" : p === "google" ? "Google Ads" : "LinkedIn Ads"}
                </button>
              ))}
            </div>
            <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
              {["all", "Active", "Paused", "Draft"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    statusFilter === s ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"
                  }`}
                >
                  {s === "all" ? "All Status" : s}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Table */}
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Campaign", "Platform", "Status", "Budget/Day", "Spend", "Impressions", "CTR", "Conversions", "CPA", "ROAS", "QS"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-slate-500 font-medium whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-slate-900">{c.name}</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">{c.type} Â· {c.objective}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <PlatformBadge platform={c.platform} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColor(c.status)}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(c.budget_daily)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(c.spend, true)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.impressions, true)}</td>
                  <td className="px-4 py-3">
                    <span className={c.ctr > 2.5 ? "text-emerald-400" : c.ctr < 1.5 ? "text-red-400" : "text-slate-700"}>
                      {formatPct(c.ctr)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(c.conversions)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatCurrency(c.cpa)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {c.roas >= 4 ? (
                        <TrendingUp size={11} className="text-emerald-400" />
                      ) : c.roas < 2.5 ? (
                        <TrendingDown size={11} className="text-red-400" />
                      ) : null}
                      <span className={c.roas >= 4 ? "text-emerald-400 font-semibold" : c.roas < 2.5 ? "text-red-400" : "text-slate-700"}>
                        {c.roas.toFixed(1)}x
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-14 h-1.5 rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${c.quality_score}%`,
                            background: c.quality_score >= 70 ? "#10b981" : c.quality_score >= 50 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                      <span className={c.quality_score >= 70 ? "text-emerald-400" : c.quality_score >= 50 ? "text-amber-400" : "text-red-400"}>
                        {c.quality_score}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">No campaigns match your filters.</div>
          )}
        </Card>
      </div>
    </div>
  );
}

