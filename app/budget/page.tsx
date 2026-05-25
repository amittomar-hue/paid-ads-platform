"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { Sparkles, Loader2, DollarSign, ArrowRightLeft, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

interface AllocationResult {
  allocation: {
    platform: string;
    budget: number;
    percentage: number;
    rationale: string;
    expected_roas: number;
    expected_conversions: number;
    expected_cpa: number;
  }[];
  monthly_pacing: { week: string; google: number; linkedin: number }[];
  optimization_milestones: string[];
  risk_assessment: { level: string; factors: string[]; mitigation: string[] };
  recommendations: string[];
  total_expected: { impressions: number; clicks: number; conversions: number; revenue: number };
}

const REALLOCATION_SIGNALS = {
  google: { cpa: 238, target: 280, roas: 4.2, targetRoas: 3.5, status: "below_target", label: "20% below CPA target" },
  linkedin: { cpa: 910, target: 700, roas: 2.1, targetRoas: 3.0, status: "above_target", label: "30% above CPA target" },
  recommendation: { shiftAmount: 18000, shiftPct: 15, fromPlatform: "linkedin", toPlatform: "google", projectedImpact: "+₹62K monthly revenue", confidence: 87 },
};

const OBJECTIVES = ["Conversions", "Lead Generation", "Brand Awareness", "ROAS Maximization"];

export default function BudgetPage() {
  const [totalBudget, setTotalBudget] = useState("200000");
  const [objective, setObjective] = useState("Conversions");
  const [platforms, setPlatforms] = useState<string[]>(["google", "linkedin"]);
  const [industry, setIndustry] = useState("SaaS / Technology");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [error, setError] = useState("");

  function togglePlatform(p: string) {
    setPlatforms((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);
  }

  async function plan() {
    if (platforms.length === 0) { setError("Select at least one platform."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const prompt = `You are an expert paid advertising budget strategist. Create a budget allocation plan.

Total Monthly Budget: ₹${totalBudget}
Objective: ${objective}
Platforms: ${platforms.join(", ")}
Industry: ${industry}

Return ONLY valid JSON:
{
  "allocation": [
    {
      "platform": string,
      "budget": number,
      "percentage": number,
      "rationale": string,
      "expected_roas": number,
      "expected_conversions": number,
      "expected_cpa": number
    }
  ],
  "monthly_pacing": [
    { "week": "Week 1", "google": number, "linkedin": number },
    { "week": "Week 2", "google": number, "linkedin": number },
    { "week": "Week 3", "google": number, "linkedin": number },
    { "week": "Week 4", "google": number, "linkedin": number }
  ],
  "optimization_milestones": string[],
  "risk_assessment": {
    "level": "Low"|"Medium"|"High",
    "factors": string[],
    "mitigation": string[]
  },
  "recommendations": string[],
  "total_expected": { "impressions": number, "clicks": number, "conversions": number, "revenue": number }
}`;

      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, max_tokens: 2500 }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response");
      setResult(JSON.parse(jsonMatch[0]));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to plan budget.");
    } finally {
      setLoading(false);
    }
  }

  const COLORS: Record<string, string> = { google: "#4285f4", linkedin: "#0077b5" };

  const [reallocationDismissed, setReallocationDismissed] = useState(false);
  const [reallocationApproved, setReallocationApproved] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Budget Intelligence" subtitle="AI-powered budget allocation, pacing strategy, and cross-channel reallocation" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Cross-Channel Reallocation Alert (Section 8.3) */}
        {!reallocationDismissed && !reallocationApproved && (
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/8">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <ArrowRightLeft size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white mb-1">Cross-Channel Reallocation Opportunity</p>
                  <p className="text-xs text-slate-400 mb-3">
                    Google Ads CPA is <span className="text-emerald-400 font-medium">20% below target</span> (₹238 vs ₹280 target) · LinkedIn CPA is <span className="text-red-400 font-medium">30% above target</span> (₹910 vs ₹700 target) for 14 consecutive days.
                    The system recommends shifting <strong className="text-white">₹18,000/day (15%)</strong> from LinkedIn to Google.
                  </p>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    {[
                      { label: "Shift Amount", value: "₹18,000/day", color: "#f59e0b" },
                      { label: "Projected Impact", value: REALLOCATION_SIGNALS.recommendation.projectedImpact, color: "#10b981" },
                      { label: "Model Confidence", value: `${REALLOCATION_SIGNALS.recommendation.confidence}%`, color: "#4285f4" },
                    ].map((s) => (
                      <div key={s.label} className="p-2 rounded-lg bg-white/5 border border-white/8">
                        <p className="text-[10px] text-slate-500">{s.label}</p>
                        <p className="text-xs font-semibold" style={{ color: s.color }}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1">
                    <AlertTriangle size={9} /> Requires human approval per Section 8.3 — reallocation is constrained to ≤15% to prevent campaign viability breach
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setReallocationApproved(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs hover:bg-emerald-500/25 transition-colors font-medium">
                  <CheckCircle size={12} /> Approve
                </button>
                <button onClick={() => setReallocationDismissed(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/8 text-slate-400 text-xs hover:bg-white/12 transition-colors">
                  <XCircle size={12} /> Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        {reallocationApproved && (
          <div className="p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium">Reallocation approved — ₹18,000/day shift from LinkedIn to Google will take effect at next pacing cycle.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="self-start">
            <CardHeader title="Configure Budget" />
            <div className="space-y-4">
              <Input label="Total Monthly Budget (₹)" type="number" value={totalBudget} onChange={(e) => setTotalBudget(e.target.value)} />
              <Select label="Campaign Objective" value={objective} onChange={(e) => setObjective(e.target.value)} options={OBJECTIVES.map((o) => ({ value: o, label: o }))} />
              <Input label="Industry / Vertical" value={industry} onChange={(e) => setIndustry(e.target.value)} />
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Platforms</p>
                {[{ id: "google", label: "Google Ads" }, { id: "linkedin", label: "LinkedIn Ads" }].map((p) => (
                  <label key={p.id} className="flex items-center gap-2.5 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={platforms.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                      className="w-3.5 h-3.5 accent-blue-500"
                    />
                    <span className="text-sm text-slate-300">{p.label}</span>
                  </label>
                ))}
              </div>
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <Button variant="primary" size="md" onClick={plan} disabled={loading} className="w-full justify-center">
                {loading ? <><Loader2 size={13} className="animate-spin" /> Planning...</> : <><DollarSign size={13} /> Generate Budget Plan</>}
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-5">
            {!result && !loading && (
              <Card className="flex flex-col items-center justify-center py-20 text-center">
                <DollarSign size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">Configure your budget and get an AI allocation plan</p>
              </Card>
            )}
            {loading && (
              <Card className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Calculating optimal budget allocation...</p>
              </Card>
            )}
            {result && (
              <>
                {/* Allocation cards */}
                <div className="grid grid-cols-1 gap-4">
                  {result.allocation.map((a, i) => (
                    <Card key={i}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ background: COLORS[a.platform] ?? "#4285f4" }}>
                          {a.platform === "google" ? "G" : "in"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-white capitalize">{a.platform === "google" ? "Google Ads" : "LinkedIn Ads"}</p>
                            <div className="text-right">
                              <p className="text-sm font-bold text-white">₹{a.budget.toLocaleString("en-IN")}</p>
                              <p className="text-xs text-slate-500">{a.percentage}% of budget</p>
                            </div>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/8 mb-2">
                            <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: COLORS[a.platform] ?? "#4285f4" }} />
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{a.rationale}</p>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { label: "ROAS", value: `${a.expected_roas}x` },
                              { label: "Conversions", value: a.expected_conversions?.toLocaleString() },
                              { label: "CPA", value: `₹${a.expected_cpa?.toLocaleString("en-IN")}` },
                            ].map((m) => (
                              <div key={m.label} className="bg-white/4 rounded p-2 text-center">
                                <p className="text-[10px] text-slate-500">{m.label}</p>
                                <p className="text-xs font-semibold text-white">{m.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Monthly Pacing Chart */}
                <Card>
                  <CardHeader title="Monthly Pacing" subtitle="Recommended weekly spend" />
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={result.monthly_pacing} barSize={14} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 1000}K`} />
                      <Tooltip contentStyle={{ background: "#1c1c24", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f1f5f9", fontSize: 12 }} />
                      <Bar dataKey="google" name="Google" fill="#4285f4" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="linkedin" name="LinkedIn" fill="#0077b5" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Expected Results */}
                <Card>
                  <CardHeader title="Expected Monthly Results" />
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(result.total_expected).map(([k, v]) => (
                      <div key={k} className="bg-white/4 rounded-lg p-3 text-center">
                        <p className="text-[10px] text-slate-500 capitalize">{k}</p>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {k === "revenue" ? `₹${Number(v).toLocaleString("en-IN")}` : Number(v).toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Risk + Milestones */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader title="Risk Assessment" />
                    <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium mb-3 ${
                      result.risk_assessment.level === "Low" ? "bg-emerald-500/15 text-emerald-400" :
                      result.risk_assessment.level === "Medium" ? "bg-amber-500/15 text-amber-400" : "bg-red-500/15 text-red-400"
                    }`}>
                      {result.risk_assessment.level} Risk
                    </div>
                    <ul className="space-y-1 mb-3">
                      {result.risk_assessment.factors.map((f, i) => (
                        <li key={i} className="text-xs text-slate-400">• {f}</li>
                      ))}
                    </ul>
                    <p className="text-[10px] text-slate-500 font-medium uppercase mb-1">Mitigation</p>
                    {result.risk_assessment.mitigation.map((m, i) => (
                      <p key={i} className="text-xs text-slate-300 mb-0.5">• {m}</p>
                    ))}
                  </Card>
                  <Card>
                    <CardHeader title="Optimization Milestones" />
                    <ul className="space-y-2">
                      {result.optimization_milestones.map((m, i) => (
                        <li key={i} className="flex gap-2 text-xs text-slate-300">
                          <span className="text-blue-400 font-bold">{i + 1}.</span> {m}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
