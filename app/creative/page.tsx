"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Sparkles, Loader2, Copy, CheckCheck, TrendingUp, FileText, CheckCircle2 } from "lucide-react";

const PLATFORMS = [
  {
    id: "google",
    name: "Google Ads",
    formats: ["Responsive Search Ad", "Expanded Text Ad", "Display Ad", "Performance Max Asset"],
  },
  {
    id: "linkedin",
    name: "LinkedIn Ads",
    formats: ["Sponsored Content", "Sponsored InMail", "Text Ad", "Dynamic Ad", "Carousel Ad"],
  },
];

const TONES = ["Professional", "Conversational", "Urgent", "Bold", "Witty", "Empathetic"];

const LEAD_GEN_STEPS = [
  { step: "Form Creation", detail: "AI builds LinkedIn Lead Gen Form from campaign objective. Fields auto-mapped: First Name, Last Name, Company, Job Title, Email, Phone (optional)." },
  { step: "Progressive Profiling", detail: "Return visitors shown shorter forms. Completed fields pre-filled from LinkedIn profile data. Max 3 new fields per return visit." },
  { step: "CRM Sync", detail: "Submissions pushed to CRM via webhook within 60 seconds. Field mapping: LinkedIn → CRM schema auto-detected. Duplicate detection via email hash." },
  { step: "Immediate Follow-Up", detail: "Trigger nurture email within 5 minutes of submission. Assign to sales rep based on territory/ICP score. Log touchpoint in CRM timeline." },
  { step: "Lead Scoring", detail: "Score submitted leads 0–100 using job title, company size, industry match vs. ICP. MQL threshold: ≥ 65. Auto-route hot leads (≥ 80) to SDR queue." },
  { step: "Performance Loop", detail: "A/B test form field length vs. conversion rate weekly. Pause underperforming forms (< 2% CVR after 500 impressions). Surface winning variant." },
];

interface AdVariant {
  label: string;
  headline_1: string;
  headline_2: string;
  headline_3?: string;
  description_1: string;
  description_2?: string;
  cta: string;
  score: number;
  why_it_works: string;
}

interface CreativeResult {
  variants: AdVariant[];
  hooks: string[];
  power_words: string[];
  cta_options: string[];
  ab_test_recommendation: string;
  platform_tips: string[];
}

export default function CreativePage() {
  const [platform, setPlatform] = useState("google");
  const [format, setFormat] = useState("Responsive Search Ad");
  const [tone, setTone] = useState("Professional");
  const [product, setProduct] = useState("");
  const [usp, setUsp] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CreativeResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const selectedPlatform = PLATFORMS.find((p) => p.id === platform)!;

  async function generate() {
    if (!product.trim()) { setError("Please describe your product."); return; }
    setError(""); setLoading(true); setResult(null);
    try {
      const isGoogle = platform === "google";
      const prompt = `You are an expert paid ads copywriter. Create ${isGoogle ? "Google Ads" : "LinkedIn Ads"} copy.

Platform: ${selectedPlatform.name}
Format: ${format}
Tone: ${tone}
Product/Service: ${product}
Unique Selling Points: ${usp}
Target Audience: ${targetAudience}

Return ONLY valid JSON:
{
  "variants": [
    {
      "label": "Variant A",
      "headline_1": string (max 30 chars for Google, 200 for LinkedIn),
      "headline_2": string,
      ${isGoogle ? '"headline_3": string,' : ''}
      "description_1": string (max 90 chars for Google, 600 for LinkedIn),
      ${isGoogle ? '"description_2": string,' : ''}
      "cta": string,
      "score": number (0-100),
      "why_it_works": string
    },
    { "label": "Variant B", ... },
    { "label": "Variant C", ... }
  ],
  "hooks": string[],
  "power_words": string[],
  "cta_options": string[],
  "ab_test_recommendation": string,
  "platform_tips": string[]
}`;

      const res = await fetch("/api/ai", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt, max_tokens: 3000 }) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid response format");
      setResult(JSON.parse(jsonMatch[0]));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate copy.");
    } finally {
      setLoading(false);
    }
  }

  function copyVariant(v: AdVariant) {
    const text = [v.headline_1, v.headline_2, v.headline_3, "", v.description_1, v.description_2, "", `CTA: ${v.cta}`]
      .filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(v.label);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Creative Engine" subtitle="AI-powered ad copy generation with A/B variants" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config Panel */}
          <Card className="lg:col-span-1 self-start">
            <CardHeader title="Generate Ad Copy" />
            <div className="space-y-4">
              {/* Platform */}
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Platform</p>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPlatform(p.id); setFormat(p.formats[0]); }}
                      className={`p-2.5 rounded-lg border text-xs font-medium transition-colors ${
                        platform === p.id ? "border-blue-500/40 bg-blue-500/10 text-blue-400" : "border-slate-200 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              <Select
                label="Ad Format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                options={selectedPlatform.formats.map((f) => ({ value: f, label: f }))}
              />

              <div>
                <p className="text-xs font-medium text-slate-400 mb-2">Tone</p>
                <div className="flex flex-wrap gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        tone === t ? "bg-blue-600 text-slate-900" : "bg-slate-100 text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <Textarea
                label="Product / Service"
                placeholder="What are you advertising?"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                rows={2}
              />
              <Textarea
                label="Unique Selling Points"
                placeholder="What makes you different? (e.g. 50% faster, free trial, 24/7 support)"
                value={usp}
                onChange={(e) => setUsp(e.target.value)}
                rows={2}
              />
              <Input
                label="Target Audience"
                placeholder="Who are you targeting?"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
              />

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <Button
                variant="primary"
                size="md"
                onClick={generate}
                disabled={loading}
                className="w-full justify-center"
              >
                {loading ? <><Loader2 size={13} className="animate-spin" /> Generating...</> : <><Sparkles size={13} /> Generate 3 Variants</>}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="lg:col-span-2 space-y-5">
            {platform === "linkedin" && (
              <Card>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={15} className="text-sky-500" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Lead Gen Form Automation (§5.5)</h3>
                    <p className="text-xs text-slate-500 mt-0.5">LinkedIn Lead Gen Forms — end-to-end automation pipeline</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {LEAD_GEN_STEPS.map((s, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="w-5 h-5 rounded-full bg-sky-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={11} className="text-sky-500" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{s.step}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {!result && !loading && (
              <Card className="flex flex-col items-center justify-center py-20 text-center">
                <Sparkles size={32} className="text-slate-500 mb-3" />
                <p className="text-sm text-slate-400">Configure your campaign and generate AI copy</p>
              </Card>
            )}

            {loading && (
              <Card className="flex flex-col items-center justify-center py-20">
                <Loader2 size={32} className="text-blue-400 animate-spin mb-3" />
                <p className="text-sm text-slate-400">Writing your ad copy...</p>
              </Card>
            )}

            {result && (
              <>
                {/* Variants */}
                <div className="space-y-4">
                  {result.variants.map((v, i) => (
                    <Card key={i}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{v.label}</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={11} className="text-blue-400" />
                            <span className="text-xs text-blue-400 font-medium">Score: {v.score}/100</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyVariant(v)}
                        >
                          {copied === v.label ? <><CheckCheck size={12} className="text-emerald-400" /> Copied</> : <><Copy size={12} /> Copy</>}
                        </Button>
                      </div>

                      {/* Ad preview */}
                      {platform === "google" ? (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                          <p className="text-xs text-slate-500">ads · example.com</p>
                          <p className="text-sm font-medium text-blue-400">{v.headline_1} | {v.headline_2}{v.headline_3 ? ` | ${v.headline_3}` : ""}</p>
                          <p className="text-xs text-slate-700">{v.description_1}{v.description_2 ? ` ${v.description_2}` : ""}</p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <p className="text-sm font-semibold text-slate-900 mb-1">{v.headline_1}</p>
                          {v.headline_2 && <p className="text-sm text-slate-700 mb-2">{v.headline_2}</p>}
                          <p className="text-xs text-slate-400">{v.description_1}</p>
                          <button className="mt-3 px-4 py-1.5 rounded bg-sky-600 text-slate-900 text-xs font-medium">{v.cta}</button>
                        </div>
                      )}

                      <p className="text-xs text-slate-500 mt-2 italic">{v.why_it_works}</p>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader title="Power Words" />
                    <div className="flex flex-wrap gap-1.5">
                      {result.power_words?.map((w) => (
                        <span key={w} className="px-2 py-0.5 bg-purple-500/15 text-purple-400 rounded text-xs">{w}</span>
                      ))}
                    </div>
                  </Card>
                  <Card>
                    <CardHeader title="CTA Options" />
                    <div className="flex flex-wrap gap-1.5">
                      {result.cta_options?.map((c) => (
                        <span key={c} className="px-2 py-0.5 bg-blue-500/15 text-blue-400 rounded text-xs">{c}</span>
                      ))}
                    </div>
                  </Card>
                </div>

                <Card>
                  <CardHeader title="A/B Test Recommendation" />
                  <p className="text-xs text-slate-700">{result.ab_test_recommendation}</p>
                </Card>

                {result.platform_tips?.length > 0 && (
                  <Card>
                    <CardHeader title="Platform Tips" />
                    <ul className="space-y-1.5">
                      {result.platform_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <span className="text-blue-400 mt-0.5">→</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
