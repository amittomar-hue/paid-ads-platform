"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, PlatformBadge } from "@/components/ui/Badge";
import { MOCK_CAMPAIGNS, MOCK_OPTIMIZATIONS } from "@/lib/mock-data";
import { riskColor } from "@/lib/utils";
import {
  Zap, Loader2, CheckCircle, XCircle, Clock, ShieldAlert,
  TrendingUp, AlertTriangle, Info, RotateCcw, Users
} from "lucide-react";

interface OptResult {
  overall_score: number;
  grade: string;
  issues: { severity: string; title: string; description: string; fix: string }[];
  bid_recommendations: { strategy: string; rationale: string; expected_impact: string }[];
  budget_recommendations: string[];
  audience_insights: string[];
  quick_wins: string[];
  forecast_30d: { metric: string; current: string; predicted: string; change: string }[];
}

export default function OptimizePage() {
  const [selectedCampaign, setSelectedCampaign] = useState(MOCK_CAMPAIGNS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptResult | null>(null);
  const [error, setError] = useState("");

  async function runOptimization() {
    setLoading(true); setError(""); setResult(null);
    try {
      const c = selectedCampaign;
      const prompt = `You are an expert paid ads optimization AI. Analyze this campaign and return ONLY valid JSON.

Campaign: ${c.name}
Platform: ${c.platform}
Type: ${c.type}
Status: ${c.status}
Daily Budget: ₹${c.budget_daily}
Spend: ₹${c.spend}
Impressions: ${c.impressions}
Clicks: ${c.clicks}
CTR: ${c.ctr}%
CPC: ₹${c.cpc}
Conversions: ${c.conversions}
CPA: ₹${c.cpa}
ROAS: ${c.roas}x
Quality Score: ${c.quality_score}/100

Return JSON:
{
  "overall_score": number (0-100),
  "grade": "A"|"B"|"C"|"D"|"F",
  "issues": [{"severity":"Critical"|"Warning"|"Opportunity","title":string,"description":string,"fix":string}],
  "bid_recommendations": [{"strategy":string,"rationale":string,"expected_impact":string}],
  "budget_recommendations": string[],
  "audience_insights": string[],
  "quick_wins": string[],
  "forecast_30d": [{"metric":string,"current":string,"predicted":string,"change":string}]
}`;

      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, max_tokens: 2500 }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response");
      setResult(JSON.parse(jsonMatch[0]));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Optimization failed.");
    } finally {
      setLoading(false);
    }
  }

  const severityIcon = (s: string) => s === "Critical" ? <AlertTriangle size={13} className="text-red-400" /> : s === "Warning" ? <AlertTriangle size={13} className="text-amber-400" /> : <Info size={13} className="text-blue-400" />;
  const gradeColor = (g: string) => ({ A: "text-emerald-400", B: "text-blue-400", C: "text-amber-400", D: "text-orange-400", F: "text-red-400" }[g] ?? "text-slate-400");

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Optimization Engine" subtitle="AI-powered campaign health analysis and action recommendations" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Campaign Selection + Pending Actions */}
          <div className="space-y-5">
            <Card>
              <CardHeader title="Select Campaign" />
              <div className="space-y-2">
                {MOCK_CAMPAIGNS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCampaign(c); setResult(null); }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedCampaign.id === c.id
                        ? "border-blue-500/40 bg-blue-500/10"
                        : "border-white/6 bg-white/3 hover:border-white/12"
                    }`}
                  >
                    <p className="text-xs font-medium text-white">{c.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PlatformBadge platform={c.platform} />
                      <span className="text-[10px] text-slate-500">ROAS {c.roas}x · QS {c.quality_score}</span>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={runOptimization}
                disabled={loading}
                className="w-full justify-center mt-4"
              >
                {loading ? <><Loader2 size={13} className="animate-spin" /> Analyzing...</> : <><Zap size={13} /> Run Optimization</>}
              </Button>
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </Card>

            {/* 4-Tier Approval Workflow */}
            <Card>
              <CardHeader title="Approval Workflow" subtitle="4-tier automated decision system" />
              <div className="space-y-2">
                {MOCK_OPTIMIZATIONS.map((action) => {
                  const tier = action.risk;
                  const tierCfg = {
                    LOW:      { label: "Auto-Executed",          bg: "bg-emerald-500/8 border-emerald-500/20", badge: "bg-emerald-500/15 text-emerald-400" },
                    MEDIUM:   { label: "Applied · 2h Undo",       bg: "bg-blue-500/8 border-blue-500/20",     badge: "bg-blue-500/15 text-blue-400" },
                    HIGH:     { label: "Pending Approval",        bg: "bg-amber-500/8 border-amber-500/20",   badge: "bg-amber-500/15 text-amber-400" },
                    CRITICAL: { label: "2-Person Approval Req.",  bg: "bg-red-500/8 border-red-500/20",       badge: "bg-red-500/15 text-red-400" },
                  }[tier] ?? { label: tier, bg: "bg-white/3 border-white/6", badge: "bg-slate-500/15 text-slate-400" };

                  return (
                    <div key={action.id} className={`p-3 rounded-lg border ${tierCfg.bg}`}>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {tier === "LOW" && <CheckCircle size={11} className="text-emerald-400 flex-shrink-0" />}
                          {tier === "MEDIUM" && <Clock size={11} className="text-blue-400 flex-shrink-0" />}
                          {tier === "HIGH" && <AlertTriangle size={11} className="text-amber-400 flex-shrink-0" />}
                          {tier === "CRITICAL" && <ShieldAlert size={11} className="text-red-400 flex-shrink-0" />}
                          <p className="text-xs font-medium text-white truncate">{action.type}</p>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium flex-shrink-0 ${tierCfg.badge}`}>{tierCfg.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">{action.description}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-emerald-400 flex-1">{action.estimated_improvement}</span>
                        {tier === "MEDIUM" && action.approval_status === "approved" && (
                          <button className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
                            <RotateCcw size={10} /> Undo (1h 42m left)
                          </button>
                        )}
                        {tier === "HIGH" && action.approval_status === "pending" && (
                          <div className="flex gap-1">
                            <span className="text-[10px] text-amber-400 flex items-center gap-1 mr-1"><Clock size={9} /> 4h SLA</span>
                            <button className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 text-[10px] hover:bg-emerald-500/25 transition-colors"><CheckCircle size={10} /></button>
                            <button className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] hover:bg-red-500/25 transition-colors"><XCircle size={10} /></button>
                          </div>
                        )}
                        {tier === "CRITICAL" && action.approval_status === "pending" && (
                          <div className="flex items-center gap-1">
                            <Users size={10} className="text-red-400" />
                            <span className="text-[10px] text-red-400">2 approvers needed</span>
                            <button className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] hover:bg-red-500/25 transition-colors ml-1">Approve (1/2)</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 p-2.5 rounded-lg bg-white/3 border border-white/6 space-y-1 text-[10px] text-slate-500">
                <p className="flex items-center gap-1.5"><span className="text-emerald-400 font-medium">LOW</span> &lt;10% budget / &lt;20% bid → Auto-execute</p>
                <p className="flex items-center gap-1.5"><span className="text-blue-400 font-medium">MEDIUM</span> 10–25% budget / 20–50% bid → Auto + 2h undo</p>
                <p className="flex items-center gap-1.5"><span className="text-amber-400 font-medium">HIGH</span> &gt;25% budget / &gt;50% bid → 4h approval SLA</p>
                <p className="flex items-center gap-1.5"><span className="text-red-400 font-medium">CRITICAL</span> Campaign deletion / account changes → 2-person approval</p>
              </div>
            </Card>
          </div>

          {/* Right: Analysis Results */}
          <div className="lg:col-span-2 space-y-5">
            {!result && !loading && (
              <Card className="flex flex-col items-center justify-center py-20 text-center">
                <Zap size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">Select a campaign and run optimization analysis</p>
                <p className="text-xs text-slate-600 mt-1">AI will analyze performance and generate actionable recommendations</p>
              </Card>
            )}

            {loading && (
              <Card className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Analyzing {selectedCampaign.name}...</p>
                <p className="text-xs text-slate-600 mt-1">Running ML models · Checking bid efficiency · Auditing quality signals</p>
              </Card>
            )}

            {result && (
              <>
                {/* Grade Card */}
                <Card>
                  <div className="flex items-center gap-5">
                    <div className="text-center">
                      <p className={`text-5xl font-black ${gradeColor(result.grade)}`}>{result.grade}</p>
                      <p className="text-xs text-slate-500 mt-1">Grade</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs text-slate-400">Overall Health Score</p>
                        <p className="text-sm font-bold text-white">{result.overall_score}/100</p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/8">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${result.overall_score}%`,
                            background: result.overall_score >= 70 ? "#10b981" : result.overall_score >= 50 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Issues */}
                <Card>
                  <CardHeader title="Issues & Opportunities" subtitle={`${result.issues.length} found`} />
                  <div className="space-y-3">
                    {result.issues.map((issue, i) => (
                      <div key={i} className={`p-3 rounded-lg border ${
                        issue.severity === "Critical" ? "bg-red-500/8 border-red-500/20" :
                        issue.severity === "Warning" ? "bg-amber-500/8 border-amber-500/20" :
                        "bg-blue-500/8 border-blue-500/20"
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {severityIcon(issue.severity)}
                          <p className="text-xs font-medium text-white">{issue.title}</p>
                          <span className={`ml-auto text-[10px] font-medium ${
                            issue.severity === "Critical" ? "text-red-400" : issue.severity === "Warning" ? "text-amber-400" : "text-blue-400"
                          }`}>{issue.severity}</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-1.5">{issue.description}</p>
                        <p className="text-xs text-slate-300">
                          <span className="text-slate-500">Fix: </span>{issue.fix}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* 30-Day Forecast */}
                <Card>
                  <CardHeader title="30-Day Forecast" subtitle="If recommendations are applied" />
                  <div className="grid grid-cols-2 gap-2">
                    {result.forecast_30d.map((f, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/4 border border-white/8">
                        <p className="text-[10px] text-slate-500">{f.metric}</p>
                        <div className="flex items-end justify-between mt-1">
                          <p className="text-xs text-slate-400">{f.current}</p>
                          <p className="text-xs font-semibold text-white">→ {f.predicted}</p>
                        </div>
                        <p className="text-[10px] text-emerald-400 mt-0.5">{f.change}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Wins */}
                <Card>
                  <CardHeader title="Quick Wins" subtitle="Low-effort, high-impact actions" />
                  <ul className="space-y-2">
                    {result.quick_wins.map((win, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle size={12} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                        {win}
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Bid Recommendations */}
                <Card>
                  <CardHeader title="Bid Strategy Recommendations" />
                  <div className="space-y-3">
                    {result.bid_recommendations.map((b, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/4">
                        <p className="text-xs font-medium text-white mb-1">{b.strategy}</p>
                        <p className="text-xs text-slate-400 mb-1">{b.rationale}</p>
                        <p className="text-xs text-emerald-400">{b.expected_impact}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
