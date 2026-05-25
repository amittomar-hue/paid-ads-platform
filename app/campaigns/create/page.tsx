"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, CheckCircle, Loader2, ChevronRight } from "lucide-react";

const PLATFORMS = [
  { id: "google", name: "Google Ads", icon: "G", color: "#4285f4", types: ["Search", "Performance Max", "Display", "Shopping", "Video"], objectives: ["Conversions", "Website Traffic", "Brand Awareness", "App Installs"] },
  { id: "linkedin", name: "LinkedIn Ads", icon: "in", color: "#0077b5", types: ["Sponsored Content", "Sponsored InMail", "Text Ads", "Dynamic Ads"], objectives: ["Lead Generation", "Website Visits", "Brand Awareness", "Engagement"] },
];

interface PlanResult {
  campaign: { name: string; type: string; objective: string; platform: string; budget_daily: number; budget_total: number; bidding_strategy: string; target_roas?: number };
  targeting: { locations: string[]; languages: string[]; age_range?: string; interests?: string[]; keywords?: string[]; job_titles?: string[]; industries?: string[]; audience_size?: string };
  ad_structure: { campaign_name: string; ad_groups: { name: string; theme: string; keywords?: string[]; bid: number }[] };
  budget_breakdown: { daily: number; weekly: number; monthly: number; recommended_increase?: string };
  kpi_targets: { impressions: number; clicks: number; ctr: string; conversions: number; cpa: number; roas: string };
  launch_checklist: string[];
  ai_recommendations: string[];
}

export default function CreateCampaignPage() {
  const [step, setStep] = useState<"form" | "plan">("form");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<PlanResult | null>(null);
  const [error, setError] = useState("");

  const [platform, setPlatform] = useState("google");
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [campaignType, setCampaignType] = useState("Search");
  const [objective, setObjective] = useState("Conversions");
  const [budget, setBudget] = useState("5000");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("India");
  const [language, setLanguage] = useState("English");

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)!;

  async function generatePlan() {
    if (!product.trim()) { setError("Please describe your product/service."); return; }
    setError(""); setLoading(true);
    try {
      const prompt = `You are an expert paid advertising strategist. Create a comprehensive campaign plan for:

Platform: ${selectedPlatform.name}
Product/Service: ${product}
Target Audience: ${audience}
Campaign Type: ${campaignType}
Objective: ${objective}
Daily Budget: ₹${budget}
Duration: ${duration} days
Location: ${location}
Language: ${language}

Return ONLY valid JSON matching exactly this schema:
{
  "campaign": { "name": string, "type": string, "objective": string, "platform": string, "budget_daily": number, "budget_total": number, "bidding_strategy": string, "target_roas": number },
  "targeting": { "locations": string[], "languages": string[], ${platform === "google" ? '"age_range": string, "interests": string[], "keywords": string[]' : '"job_titles": string[], "industries": string[], "seniority": string[]'}, "audience_size": string },
  "ad_structure": { "campaign_name": string, "ad_groups": [{ "name": string, "theme": string, ${platform === "google" ? '"keywords": string[],' : ''} "bid": number }] },
  "budget_breakdown": { "daily": number, "weekly": number, "monthly": number, "recommended_increase": string },
  "kpi_targets": { "impressions": number, "clicks": number, "ctr": string, "conversions": number, "cpa": number, "roas": string },
  "launch_checklist": string[],
  "ai_recommendations": string[]
}`;

      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, max_tokens: 3000 }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      setPlan(JSON.parse(jsonMatch[0]));
      setStep("plan");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Create Campaign"
        subtitle="AI-powered campaign setup for Google Ads & LinkedIn Ads"
        action={
          step === "plan" && (
            <Button variant="ghost" size="sm" onClick={() => setStep("form")}>
              ← Back to Form
            </Button>
          )
        }
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Step indicator */}
          <div className="flex items-center gap-3 text-xs">
            <div className={`flex items-center gap-1.5 ${step === "form" ? "text-blue-400" : "text-emerald-400"}`}>
              {step === "plan" ? <CheckCircle size={13} /> : <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-slate-900 text-[10px] font-bold">1</span>}
              Campaign Details
            </div>
            <ChevronRight size={12} className="text-slate-500" />
            <div className={`flex items-center gap-1.5 ${step === "plan" ? "text-blue-400" : "text-slate-500"}`}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${step === "plan" ? "bg-blue-600 text-slate-900" : "bg-slate-200 text-slate-500"}`}>2</span>
              AI Plan
            </div>
          </div>

          {step === "form" && (
            <>
              {/* Platform Selector */}
              <Card>
                <CardHeader title="Select Platform" />
                <div className="grid grid-cols-2 gap-3">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlatform(p.id); setCampaignType(p.types[0]); setObjective(p.objectives[0]); }}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-colors text-left ${
                        platform === p.id
                          ? "border-blue-500/40 bg-blue-500/10"
                          : "border-slate-200 bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-900 font-bold text-sm flex-shrink-0"
                        style={{ background: p.color }}
                      >
                        {p.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.types.length} campaign types</p>
                      </div>
                      {platform === p.id && <CheckCircle size={16} className="ml-auto text-blue-400" />}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Campaign Details */}
              <Card>
                <CardHeader title="Campaign Details" />
                <div className="space-y-4">
                  <Textarea
                    label="Product / Service Description"
                    placeholder="Describe what you're advertising — the more detail you give, the better the AI plan will be..."
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    rows={3}
                  />
                  <Textarea
                    label="Target Audience"
                    placeholder="Who are you trying to reach? (e.g. CTOs at SaaS companies, online shoppers aged 25-45 in India...)"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    rows={2}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Campaign Type"
                      value={campaignType}
                      onChange={(e) => setCampaignType(e.target.value)}
                      options={selectedPlatform.types.map((t) => ({ value: t, label: t }))}
                    />
                    <Select
                      label="Objective"
                      value={objective}
                      onChange={(e) => setObjective(e.target.value)}
                      options={selectedPlatform.objectives.map((o) => ({ value: o, label: o }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Daily Budget (₹)"
                      type="number"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="5000"
                    />
                    <Input
                      label="Duration (days)"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="30"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Target Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="India"
                    />
                    <Input
                      label="Language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      placeholder="English"
                    />
                  </div>
                </div>
              </Card>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <Button
                variant="primary"
                size="lg"
                onClick={generatePlan}
                disabled={loading}
                className="w-full justify-center"
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Generating AI Plan...</>
                ) : (
                  <><Sparkles size={14} /> Generate Campaign Plan with AI</>
                )}
              </Button>
            </>
          )}

          {step === "plan" && plan && (
            <div className="space-y-5">
              <Card>
                <CardHeader title="Campaign Overview" subtitle="AI-generated plan" />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Campaign Name", value: plan.campaign.name },
                    { label: "Bidding Strategy", value: plan.campaign.bidding_strategy },
                    { label: "Daily Budget", value: `₹${plan.campaign.budget_daily?.toLocaleString("en-IN")}` },
                    { label: "Total Budget", value: `₹${plan.campaign.budget_total?.toLocaleString("en-IN")}` },
                  ].map((m) => (
                    <div key={m.label} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-[10px] text-slate-500">{m.label}</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{m.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="KPI Targets" />
                <div className="grid grid-cols-3 gap-3">
                  {Object.entries(plan.kpi_targets).map(([k, v]) => (
                    <div key={k} className="bg-slate-50 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-slate-500 capitalize">{k.replace("_", " ")}</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5">{typeof v === "number" ? v.toLocaleString("en-IN") : v}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Targeting" />
                <div className="space-y-2 text-xs">
                  {Object.entries(plan.targeting)
                    .filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : true))
                    .map(([k, v]) => (
                      <div key={k} className="flex gap-3">
                        <span className="text-slate-500 w-28 flex-shrink-0 capitalize">{k.replace(/_/g, " ")}</span>
                        <span className="text-slate-700">{Array.isArray(v) ? v.join(", ") : String(v)}</span>
                      </div>
                    ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Ad Groups" subtitle={`${plan.ad_structure.ad_groups.length} groups`} />
                <div className="space-y-3">
                  {plan.ad_structure.ad_groups.map((ag, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-xs font-medium text-slate-900">{ag.name}</p>
                        <span className="text-xs text-slate-400">Bid: ₹{ag.bid}</span>
                      </div>
                      <p className="text-xs text-slate-500">{ag.theme}</p>
                      {ag.keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {ag.keywords.slice(0, 6).map((kw: string) => (
                            <span key={kw} className="px-1.5 py-0.5 bg-blue-500/15 text-blue-400 rounded text-[10px]">{kw}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="Launch Checklist" />
                <ul className="space-y-2">
                  {plan.launch_checklist.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card>
                <CardHeader title="AI Recommendations" />
                <ul className="space-y-2">
                  {plan.ai_recommendations.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <Sparkles size={12} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              <Button variant="primary" size="lg" className="w-full justify-center">
                <CheckCircle size={14} /> Launch Campaign
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
