"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FlaskConical, TrendingUp, CheckCircle, Clock, Zap, Trophy } from "lucide-react";

interface ABTest {
  id: string;
  name: string;
  type: "Ad Copy" | "Audience" | "Landing Page" | "Bid Strategy" | "Ad Format";
  platform: "google" | "linkedin";
  campaign: string;
  status: "Running" | "Completed" | "Paused";
  startDate: string;
  variantA: { label: string; impressions: number; clicks: number; ctr: number; conversions: number; cpa: number };
  variantB: { label: string; impressions: number; clicks: number; ctr: number; conversions: number; cpa: number };
  confidence: number;
  winner?: "A" | "B";
  hypothesis: string;
  projAnnualImpact?: string;
}

const TESTS: ABTest[] = [
  {
    id: "t1", name: "RSA Headline — Direct vs Benefit-Led",
    type: "Ad Copy", platform: "google", campaign: "Brand Search — India", status: "Running", startDate: "2026-05-18",
    variantA: { label: "Direct (Control)", impressions: 14200, clicks: 426, ctr: 3.0, conversions: 28, cpa: 174.3 },
    variantB: { label: "Benefit-Led", impressions: 14600, clicks: 584, ctr: 4.0, conversions: 42, cpa: 121.7 },
    confidence: 87,
    hypothesis: "Benefit-led headlines will improve CTR by 15%+ vs direct feature-first approach.",
  },
  {
    id: "t2", name: "LinkedIn Single Image vs Carousel",
    type: "Ad Format", platform: "linkedin", campaign: "SaaS Decision Makers", status: "Running", startDate: "2026-05-20",
    variantA: { label: "Single Image", impressions: 8900, clicks: 213, ctr: 2.39, conversions: 18, cpa: 912.4 },
    variantB: { label: "Carousel (5 cards)", impressions: 9200, clicks: 294, ctr: 3.19, conversions: 24, cpa: 703.1 },
    confidence: 72,
    hypothesis: "Carousel format will drive higher engagement and lower CPL for SaaS audience.",
  },
  {
    id: "t3", name: "Target CPA vs Enhanced CPC",
    type: "Bid Strategy", platform: "google", campaign: "Competitor Keywords", status: "Completed", startDate: "2026-05-01",
    variantA: { label: "Enhanced CPC (Control)", impressions: 48000, clicks: 960, ctr: 2.0, conversions: 72, cpa: 348.9 },
    variantB: { label: "Target CPA — ₹250", impressions: 51200, clicks: 1228, ctr: 2.4, conversions: 124, cpa: 241.2 },
    confidence: 98, winner: "B",
    hypothesis: "Target CPA bidding will reduce CPA by 20% with equal or better conversion volume.",
    projAnnualImpact: "+₹1.28L in conversion value",
  },
  {
    id: "t4", name: "CTO vs VP Engineering InMail Message",
    type: "Ad Copy", platform: "linkedin", campaign: "SaaS Decision Makers", status: "Completed", startDate: "2026-04-15",
    variantA: { label: "CTO-Focused", impressions: 2400, clicks: 96, ctr: 4.0, conversions: 14, cpa: 428.6 },
    variantB: { label: "VP Engineering-Focused", impressions: 2600, clicks: 78, ctr: 3.0, conversions: 10, cpa: 612.4 },
    confidence: 94, winner: "A",
    hypothesis: "CTO persona messaging will drive higher conversion rate for our ICP.",
    projAnnualImpact: "+38% CPL improvement on InMail campaigns",
  },
  {
    id: "t5", name: "RLSA Audience Bid Adjustment — +30% vs +50%",
    type: "Audience", platform: "google", campaign: "Brand Search — India", status: "Running", startDate: "2026-05-22",
    variantA: { label: "+30% Bid (Control)", impressions: 6200, clicks: 372, ctr: 6.0, conversions: 32, cpa: 118.4 },
    variantB: { label: "+50% Bid", impressions: 6800, clicks: 476, ctr: 7.0, conversions: 45, cpa: 103.6 },
    confidence: 61,
    hypothesis: "Higher bid adjustment for retargeting audience will yield better conversion efficiency.",
  },
];

const statusColor = (s: string) => ({
  Running: "bg-blue-500/20 text-blue-400",
  Completed: "bg-emerald-500/20 text-emerald-400",
  Paused: "bg-amber-500/20 text-amber-400",
}[s] ?? "bg-slate-500/20 text-slate-400");

export default function TestsPage() {
  const [filter, setFilter] = useState<"All" | "Running" | "Completed">("All");
  const [selected, setSelected] = useState<ABTest | null>(null);

  const filtered = filter === "All" ? TESTS : TESTS.filter(t => t.status === filter);
  const running = TESTS.filter(t => t.status === "Running").length;
  const completed = TESTS.filter(t => t.status === "Completed").length;
  const winRate = Math.round((TESTS.filter(t => t.winner === "B").length / completed) * 100);

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="A/B Test Centre" subtitle="Active and completed ad experiments with statistical significance tracking" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Running Tests", value: running.toString(), icon: FlaskConical, color: "#4285f4" },
            { label: "Completed Tests", value: completed.toString(), icon: CheckCircle, color: "#10b981" },
            { label: "Challenger Win Rate", value: `${winRate}%`, icon: Trophy, color: "#f59e0b" },
            { label: "Avg. Confidence", value: `${Math.round(TESTS.filter(t => t.status === "Completed").reduce((s, t) => s + t.confidence, 0) / completed)}%`, icon: TrendingUp, color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
          {(["All", "Running", "Completed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${filter === f ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((test) => (
            <Card key={test.id} hover onClick={() => setSelected(selected?.id === test.id ? null : test)}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{test.name}</p>
                    {test.winner && <Trophy size={13} className="text-amber-400 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <PlatformBadge platform={test.platform} />
                    <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">{test.type}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(test.status)}`}>{test.status}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">Confidence</p>
                  <p className={`text-lg font-bold ${test.confidence >= 95 ? "text-emerald-400" : test.confidence >= 80 ? "text-blue-400" : "text-amber-400"}`}>
                    {test.confidence}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-400 italic mb-3">{test.hypothesis}</p>

              {/* Variant comparison */}
              <div className="grid grid-cols-2 gap-2">
                {[test.variantA, test.variantB].map((v, i) => {
                  const isWinner = (i === 0 && test.winner === "A") || (i === 1 && test.winner === "B");
                  const label = i === 0 ? "A" : "B";
                  return (
                    <div key={i} className={`p-3 rounded-lg border ${isWinner ? "border-emerald-500/30 bg-emerald-500/8" : "border-slate-200 bg-slate-50"}`}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[10px] font-bold w-4 h-4 rounded flex items-center justify-center ${isWinner ? "bg-emerald-500 text-slate-900" : "bg-slate-200 text-slate-700"}`}>{label}</span>
                        <span className="text-xs text-slate-700 truncate">{v.label}</span>
                        {isWinner && <Trophy size={10} className="text-emerald-400 flex-shrink-0" />}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { label: "CTR", value: `${v.ctr.toFixed(1)}%` },
                          { label: "Convs.", value: v.conversions.toString() },
                          { label: "CPA", value: `₹${v.cpa.toFixed(0)}` },
                          { label: "Clicks", value: v.clicks.toString() },
                        ].map((m) => (
                          <div key={m.label}>
                            <p className="text-[9px] text-slate-500">{m.label}</p>
                            <p className="text-xs font-medium text-slate-900">{m.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {test.projAnnualImpact && (
                <div className="flex items-center gap-2 mt-3 p-2 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
                  <Zap size={12} className="text-emerald-400" />
                  <span className="text-xs text-emerald-400">Projected impact: {test.projAnnualImpact}</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-3">
                {test.status === "Running" && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">Statistical confidence</span>
                      <span className="text-[10px] text-slate-400">Need 95% to declare winner</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${test.confidence}%`, background: test.confidence >= 95 ? "#10b981" : test.confidence >= 80 ? "#4285f4" : "#f59e0b" }} />
                    </div>
                  </div>
                )}
                {test.status === "Running" && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500">
                    <Clock size={10} /> Since {test.startDate}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Learning Library CTA */}
        <Card className="border-dashed border-slate-200 bg-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Learning Library</p>
              <p className="text-xs text-slate-400 mt-0.5">All test results are stored for future creative and strategy decisions</p>
            </div>
            <Button variant="outline" size="sm">
              <FlaskConical size={13} /> Launch New Test
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
