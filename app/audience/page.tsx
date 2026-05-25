"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea, Select } from "@/components/ui/Input";
import { Sparkles, Loader2, Users, Target } from "lucide-react";

interface AudienceResult {
  primary_audience: {
    description: string;
    demographics: { age?: string; gender?: string; income?: string; job_titles?: string[]; seniority?: string[]; industries?: string[] };
    interests?: string[];
    intent_signals?: string[];
    behaviours?: string[];
    estimated_size: string;
  };
  secondary_audiences: {
    name: string;
    type: string;
    description: string;
    size?: string;
    match_rate?: string;
  }[];
  exclusions: string[];
  lookalike_strategy: string;
  remarketing_strategy: string;
  audience_insights: string[];
}

const PLATFORMS = [
  { id: "google", name: "Google Ads" },
  { id: "linkedin", name: "LinkedIn Ads" },
];

const OBJECTIVES = ["Lead Generation", "Conversions", "Brand Awareness", "Website Traffic"];

export default function AudiencePage() {
  const [platform, setPlatform] = useState("google");
  const [product, setProduct] = useState("");
  const [objective, setObjective] = useState("Lead Generation");
  const [existingData, setExistingData] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AudienceResult | null>(null);
  const [error, setError] = useState("");

  async function build() {
    if (!product.trim()) { setError("Describe your product/service."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const prompt = `You are an expert paid ads audience strategist. Build a comprehensive audience strategy.

Platform: ${platform === "google" ? "Google Ads" : "LinkedIn Ads"}
Product/Service: ${product}
Campaign Objective: ${objective}
Existing Customer Data: ${existingData || "Not provided"}

Return ONLY valid JSON:
{
  "primary_audience": {
    "description": string,
    "demographics": {
      ${platform === "google" ? '"age": string, "gender": string, "income": string, "interests": string[], "intent_signals": string[], "behaviours": string[]' : '"job_titles": string[], "seniority": string[], "industries": string[], "company_size": string, "skills": string[]'},
      "estimated_size": string
    },
    "estimated_size": string
  },
  "secondary_audiences": [
    { "name": string, "type": "Lookalike"|"Retargeting"|"Interest"|"Custom Intent", "description": string, "size": string, "match_rate": string }
  ],
  "exclusions": string[],
  "lookalike_strategy": string,
  "remarketing_strategy": string,
  "audience_insights": string[]
}`;

      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, max_tokens: 2500 }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response");
      setResult(JSON.parse(jsonMatch[0]));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to build audience.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Audience Builder" subtitle="AI-powered audience segmentation and targeting strategy" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="self-start">
            <CardHeader title="Build Audience" />
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Platform</p>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p.id} onClick={() => setPlatform(p.id)}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${platform === p.id ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-white/8 text-slate-400 hover:border-white/15"}`}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>
              <Textarea label="Product / Service" placeholder="Describe what you're advertising..." value={product} onChange={(e) => setProduct(e.target.value)} rows={3} />
              <Select label="Objective" value={objective} onChange={(e) => setObjective(e.target.value)} options={OBJECTIVES.map((o) => ({ value: o, label: o }))} />
              <Textarea label="Existing Customer Data (optional)" placeholder="Any known data about your current customers..." value={existingData} onChange={(e) => setExistingData(e.target.value)} rows={2} />
              {error && <p className="text-red-400 text-xs">{error}</p>}
              <Button variant="primary" size="md" onClick={build} disabled={loading} className="w-full justify-center">
                {loading ? <><Loader2 size={13} className="animate-spin" /> Building...</> : <><Users size={13} /> Build Audience Strategy</>}
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-5">
            {!result && !loading && (
              <Card className="flex flex-col items-center justify-center py-20 text-center">
                <Users size={32} className="text-slate-600 mb-3" />
                <p className="text-sm text-slate-400">Define your product and build an AI audience strategy</p>
              </Card>
            )}
            {loading && (
              <Card className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Analyzing audience signals...</p>
              </Card>
            )}
            {result && (
              <>
                <Card>
                  <CardHeader title="Primary Audience" subtitle={`Est. size: ${result.primary_audience.estimated_size}`} />
                  <p className="text-xs text-slate-300 mb-4">{result.primary_audience.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.primary_audience.demographics ?? {}).map(([k, v]) => (
                      v && (
                        <div key={k} className="p-2.5 rounded-lg bg-white/4 border border-white/6">
                          <p className="text-[10px] text-slate-500 capitalize mb-1">{k.replace(/_/g, " ")}</p>
                          <p className="text-xs text-slate-300">{Array.isArray(v) ? v.join(", ") : String(v)}</p>
                        </div>
                      )
                    ))}
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Secondary Audiences" subtitle={`${result.secondary_audiences.length} segments`} />
                  <div className="space-y-3">
                    {result.secondary_audiences.map((a, i) => (
                      <div key={i} className="p-3 rounded-lg bg-white/4 border border-white/6">
                        <div className="flex items-center gap-2 mb-1">
                          <Target size={12} className="text-blue-400" />
                          <p className="text-xs font-medium text-white">{a.name}</p>
                          <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/15 px-1.5 py-0.5 rounded">{a.type}</span>
                        </div>
                        <p className="text-xs text-slate-400">{a.description}</p>
                        {(a.size || a.match_rate) && (
                          <div className="flex gap-3 mt-1.5">
                            {a.size && <span className="text-[10px] text-slate-500">Size: {a.size}</span>}
                            {a.match_rate && <span className="text-[10px] text-slate-500">Match: {a.match_rate}</span>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader title="Exclusions" />
                    <ul className="space-y-1.5">
                      {result.exclusions.map((e, i) => (
                        <li key={i} className="text-xs text-slate-400 flex gap-2">
                          <span className="text-red-400">✕</span> {e}
                        </li>
                      ))}
                    </ul>
                  </Card>
                  <Card>
                    <CardHeader title="Audience Insights" />
                    <ul className="space-y-1.5">
                      {result.audience_insights.slice(0, 4).map((ins, i) => (
                        <li key={i} className="text-xs text-slate-300 flex gap-2">
                          <Sparkles size={11} className="text-blue-400 mt-0.5 flex-shrink-0" /> {ins}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader title="Lookalike Strategy" />
                    <p className="text-xs text-slate-300">{result.lookalike_strategy}</p>
                  </Card>
                  <Card>
                    <CardHeader title="Remarketing Strategy" />
                    <p className="text-xs text-slate-300">{result.remarketing_strategy}</p>
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
