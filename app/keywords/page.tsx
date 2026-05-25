"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatPct } from "@/lib/utils";
import { Search, Plus, AlertTriangle, CheckCircle, XCircle, Globe, Zap, MonitorSmartphone, Link } from "lucide-react";

const KEYWORDS = [
  { id: "k1", keyword: "ai marketing software", matchType: "Exact", campaign: "Brand Search â€” India", impressions: 12400, clicks: 620, ctr: 5.0, cpc: 8.2, conversions: 48, cpa: 105.8, qs: 9, status: "Active" },
  { id: "k2", keyword: "paid ads automation", matchType: "Phrase", campaign: "Brand Search â€” India", impressions: 8900, clicks: 356, ctr: 4.0, cpc: 12.4, conversions: 28, cpa: 157.4, qs: 8, status: "Active" },
  { id: "k3", keyword: "google ads management tool", matchType: "Exact", campaign: "Competitor Keywords", impressions: 15600, clicks: 312, ctr: 2.0, cpc: 18.6, conversions: 12, cpa: 483.8, qs: 5, status: "Active" },
  { id: "k4", keyword: "free ads software", matchType: "Broad", campaign: "Competitor Keywords", impressions: 4200, clicks: 210, ctr: 5.0, cpc: 3.1, conversions: 0, cpa: 0, qs: 3, status: "Paused" },
  { id: "k5", keyword: "linkedin campaign manager alternative", matchType: "Phrase", campaign: "Brand Search â€” India", impressions: 6700, clicks: 268, ctr: 4.0, cpc: 15.2, conversions: 18, cpa: 226.2, qs: 7, status: "Active" },
  { id: "k6", keyword: "ppc management software", matchType: "Exact", campaign: "Competitor Keywords", impressions: 9800, clicks: 196, ctr: 2.0, cpc: 22.1, conversions: 8, cpa: 541.8, qs: 4, status: "Active" },
  { id: "k7", keyword: "ad optimization platform", matchType: "Phrase", campaign: "Performance Max â€” E-Commerce", impressions: 22000, clicks: 990, ctr: 4.5, cpc: 9.8, conversions: 86, cpa: 112.8, qs: 9, status: "Active" },
  { id: "k8", keyword: "marketing automation tools india", matchType: "Phrase", campaign: "Brand Search â€” India", impressions: 7200, clicks: 216, ctr: 3.0, cpc: 14.3, conversions: 14, cpa: 220.7, qs: 6, status: "Active" },
];

const NEGATIVE_QUEUE = [
  { term: "free ppc tool", spend: 840, conversions: 0, daysActive: 14, status: "pending" },
  { term: "cheap google ads", spend: 1240, conversions: 0, daysActive: 10, status: "pending" },
  { term: "diy ads management", spend: 620, conversions: 0, daysActive: 7, status: "pending" },
  { term: "how to run google ads", spend: 320, conversions: 0, daysActive: 5, status: "auto-added" },
  { term: "free linkedin advertising", spend: 980, conversions: 0, daysActive: 12, status: "auto-added" },
];

const SUGGESTIONS = [
  { keyword: "ai bid optimization", volume: "1Kâ€“10K", competition: "Medium", estCPC: 14.2, projROI: "+28%", qs_potential: 8 },
  { keyword: "automated campaign management", volume: "1Kâ€“10K", competition: "High", estCPC: 22.6, projROI: "+18%", qs_potential: 7 },
  { keyword: "smart bidding software", volume: "100â€“1K", competition: "Low", estCPC: 9.4, projROI: "+34%", qs_potential: 9 },
  { keyword: "roas optimization tool", volume: "100â€“1K", competition: "Medium", estCPC: 18.8, projROI: "+22%", qs_potential: 7 },
];

const LANDING_PAGES = [
  { adGroup: "Brand â€” Exact", url: "https://admind.ai/", lcp: 1.8, fid: 42, cls: 0.04, kwRelevance: 94, hasCTA: true, mobile: 98, status: 200, lastCheck: "10 min ago" },
  { adGroup: "Competitor â€” Phrase", url: "https://admind.ai/vs-competitors", lcp: 2.9, fid: 88, cls: 0.12, kwRelevance: 71, hasCTA: true, mobile: 84, status: 200, lastCheck: "10 min ago" },
  { adGroup: "RLSA â€” Site Visitors", url: "https://admind.ai/retarget", lcp: 1.4, fid: 31, cls: 0.02, kwRelevance: 88, hasCTA: true, mobile: 96, status: 200, lastCheck: "10 min ago" },
  { adGroup: "Generic â€” Broad", url: "https://admind.ai/features", lcp: 3.6, fid: 142, cls: 0.18, kwRelevance: 58, hasCTA: false, mobile: 72, status: 200, lastCheck: "10 min ago" },
  { adGroup: "Product â€” Exact", url: "https://admind.ai/pricing", lcp: 2.1, fid: 58, cls: 0.07, kwRelevance: 82, hasCTA: true, mobile: 91, status: 200, lastCheck: "10 min ago" },
  { adGroup: "DSA â€” Category", url: "https://admind.ai/blog/google-ads-tips", lcp: 4.2, fid: 196, cls: 0.24, kwRelevance: 44, hasCTA: false, mobile: 68, status: 200, lastCheck: "10 min ago" },
  { adGroup: "Display â€” Retarget", url: "https://admind.ai/signup", lcp: 1.6, fid: 28, cls: 0.03, kwRelevance: 91, hasCTA: true, mobile: 97, status: 200, lastCheck: "10 min ago" },
  { adGroup: "Old Campaign LP", url: "https://admind.ai/promo-2024", lcp: 0, fid: 0, cls: 0, kwRelevance: 0, hasCTA: false, mobile: 0, status: 404, lastCheck: "10 min ago" },
];

const TABS = ["All Keywords", "Negative Queue", "Suggestions", "QS Heatmap", "Landing Pages"];

const qsColor = (qs: number) =>
  qs >= 7 ? "text-emerald-400" : qs >= 4 ? "text-amber-400" : "text-red-400";

const qsBg = (qs: number) =>
  qs >= 7 ? "#10b981" : qs >= 4 ? "#f59e0b" : "#ef4444";

export default function KeywordsPage() {
  const [tab, setTab] = useState("All Keywords");
  const [search, setSearch] = useState("");
  const [negQueue, setNegQueue] = useState(NEGATIVE_QUEUE);

  const filtered = KEYWORDS.filter(
    (k) => !search || k.keyword.toLowerCase().includes(search.toLowerCase())
  );

  function approveNeg(term: string) {
    setNegQueue((prev) => prev.map((n) => n.term === term ? { ...n, status: "auto-added" } : n));
  }
  function rejectNeg(term: string) {
    setNegQueue((prev) => prev.filter((n) => n.term !== term));
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Keyword Intelligence" subtitle="Search term performance, suggestions, and negative keyword management" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Keywords", value: KEYWORDS.length.toString(), color: "#4285f4" },
            { label: "Avg Quality Score", value: (KEYWORDS.reduce((s, k) => s + k.qs, 0) / KEYWORDS.length).toFixed(1), color: "#10b981" },
            { label: "Negatives Queued", value: negQueue.filter(n => n.status === "pending").length.toString(), color: "#f59e0b" },
            { label: "New Suggestions", value: SUGGESTIONS.length.toString(), color: "#8b5cf6" },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors ${tab === t ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "All Keywords" && (
          <Card className="p-0 overflow-hidden">
            <div className="px-5 pt-5 pb-3">
              <div className="relative w-64">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search keywords..."
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/60" />
              </div>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-t border-b border-slate-200 bg-slate-50">
                  {["Keyword", "Match Type", "Campaign", "Impr.", "CTR", "CPC", "Convs.", "CPA", "QS", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((k) => (
                  <tr key={k.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-900 font-medium">{k.keyword}</td>
                    <td className="px-4 py-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        k.matchType === "Exact" ? "bg-blue-500/15 text-blue-400" :
                        k.matchType === "Phrase" ? "bg-purple-500/15 text-purple-400" : "bg-amber-500/15 text-amber-400"
                      }`}>{k.matchType}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-[11px] max-w-[160px] truncate">{k.campaign}</td>
                    <td className="px-4 py-3 text-slate-700">{k.impressions.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <span className={k.ctr > 3 ? "text-emerald-400" : k.ctr < 2 ? "text-red-400" : "text-slate-700"}>
                        {formatPct(k.ctr)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">â‚¹{k.cpc}</td>
                    <td className="px-4 py-3 text-slate-700">{k.conversions}</td>
                    <td className="px-4 py-3 text-slate-700">{k.cpa > 0 ? `â‚¹${k.cpa}` : "â€”"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-slate-100">
                          <div className="h-full rounded-full" style={{ width: `${k.qs * 10}%`, background: qsBg(k.qs) }} />
                        </div>
                        <span className={`font-semibold ${qsColor(k.qs)}`}>{k.qs}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${k.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                        {k.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "Negative Queue" && (
          <Card>
            <CardHeader title="Negative Keyword Queue" subtitle="Auto-flagged from Search Term Analysis â€” spend > 1.5x CPA, 0 conversions" />
            <div className="space-y-2">
              {negQueue.map((n) => (
                <div key={n.term} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <code className="text-sm text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded flex-1">{n.term}</code>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <span>Spend: {formatCurrency(n.spend)}</span>
                    <span>Convs: {n.conversions}</span>
                    <span>{n.daysActive} days</span>
                  </div>
                  {n.status === "pending" ? (
                    <div className="flex gap-1">
                      <button onClick={() => approveNeg(n.term)} className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 text-xs hover:bg-emerald-500/25 transition-colors flex items-center gap-1">
                        <CheckCircle size={11} /> Add
                      </button>
                      <button onClick={() => rejectNeg(n.term)} className="px-2 py-1 rounded bg-red-500/15 text-red-400 text-xs hover:bg-red-500/25 transition-colors flex items-center gap-1">
                        <XCircle size={11} /> Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle size={11} /> Added</span>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "Suggestions" && (
          <Card>
            <CardHeader title="Keyword Opportunities" subtitle="AI-generated suggestions ranked by projected ROI" />
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  {["Keyword", "Search Volume", "Competition", "Est. CPC", "Proj. ROI", "QS Potential"].map((h) => (
                    <th key={h} className="text-left pb-3 text-slate-500 font-medium pr-4">{h}</th>
                  ))}
                  <th />
                </tr>
              </thead>
              <tbody>
                {SUGGESTIONS.map((s, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    <td className="py-3 pr-4 text-slate-900 font-medium">{s.keyword}</td>
                    <td className="py-3 pr-4 text-slate-700">{s.volume}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${s.competition === "Low" ? "text-emerald-400 bg-emerald-500/15" : s.competition === "Medium" ? "text-amber-400 bg-amber-500/15" : "text-red-400 bg-red-500/15"}`}>
                        {s.competition}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-700">â‚¹{s.estCPC}</td>
                    <td className="py-3 pr-4 text-emerald-400 font-semibold">{s.projROI}</td>
                    <td className="py-3 pr-4"><span className={`font-semibold ${qsColor(s.qs_potential)}`}>{s.qs_potential}/10</span></td>
                    <td className="py-3">
                      <Button variant="outline" size="sm"><Plus size={11} /> Add</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}

        {tab === "QS Heatmap" && (
          <Card>
            <CardHeader title="Quality Score Heatmap" subtitle="All active keywords â€” darker = higher QS" />
            <div className="grid grid-cols-4 gap-2">
              {KEYWORDS.map((k) => (
                <div key={k.id} className="p-3 rounded-lg border border-slate-200"
                  style={{ background: `${qsBg(k.qs)}10` }}>
                  <div className="flex items-start justify-between mb-1">
                    <span className={`text-lg font-black ${qsColor(k.qs)}`}>{k.qs}</span>
                    <span className="text-[10px] text-slate-500">/10</span>
                  </div>
                  <p className="text-xs text-slate-700 truncate">{k.keyword}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{k.matchType}</p>
                  {k.qs < 5 && (
                    <div className="flex items-center gap-1 mt-1.5">
                      <AlertTriangle size={10} className="text-red-400" />
                      <span className="text-[10px] text-red-400">Action needed</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {tab === "Landing Pages" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Pages Passing", value: LANDING_PAGES.filter(p => p.lcp <= 2.5 && p.fid <= 100 && p.cls <= 0.1 && p.status === 200).length.toString(), color: "#10b981" },
                { label: "Issues Detected", value: LANDING_PAGES.filter(p => p.lcp > 2.5 || p.fid > 100 || p.cls > 0.1 || !p.hasCTA || p.status !== 200).length.toString(), color: "#f59e0b" },
                { label: "Broken URLs (404/500)", value: LANDING_PAGES.filter(p => p.status !== 200).length.toString(), color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Landing Page Audit</h3>
                <p className="text-xs text-slate-500 mt-0.5">Automated weekly audit â€” Core Web Vitals, keyword relevance, CTA detection, mobile score</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-t border-b border-slate-200 bg-slate-50">
                      {["Ad Group", "Landing Page", "LCP", "FID", "CLS", "KW Rel.", "CTA", "Mobile", "Status"].map((h) => (
                        <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {LANDING_PAGES.map((p, i) => (
                      <tr key={i} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${p.status !== 200 ? "opacity-60" : ""}`}>
                        <td className="px-4 py-3 text-slate-900 font-medium">{p.adGroup}</td>
                        <td className="px-4 py-3">
                          <span className="text-blue-400 text-[11px] flex items-center gap-1 truncate max-w-[180px]">
                            <Link size={10} className="flex-shrink-0" />{p.url.replace("https://", "")}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 200 ? <span className="text-slate-500">â€”</span> : (
                            <span className={p.lcp <= 2.5 ? "text-emerald-400" : p.lcp <= 4 ? "text-amber-400" : "text-red-400"}>
                              {p.lcp}s {p.lcp > 2.5 && <AlertTriangle size={10} className="inline ml-0.5" />}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 200 ? <span className="text-slate-500">â€”</span> : (
                            <span className={p.fid <= 100 ? "text-emerald-400" : "text-red-400"}>{p.fid}ms</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 200 ? <span className="text-slate-500">â€”</span> : (
                            <span className={p.cls <= 0.1 ? "text-emerald-400" : "text-red-400"}>{p.cls}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 200 ? <span className="text-slate-500">â€”</span> : (
                            <span className={p.kwRelevance >= 80 ? "text-emerald-400" : p.kwRelevance >= 60 ? "text-amber-400" : "text-red-400"}>{p.kwRelevance}%</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.hasCTA ? <CheckCircle size={13} className="text-emerald-400" /> : <XCircle size={13} className="text-red-400" />}
                        </td>
                        <td className="px-4 py-3">
                          {p.status !== 200 ? <span className="text-slate-500">â€”</span> : (
                            <span className={p.mobile >= 90 ? "text-emerald-400" : p.mobile >= 75 ? "text-amber-400" : "text-red-400"}>{p.mobile}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {p.status === 200
                            ? <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-medium">200 OK</span>
                            : <span className="text-[10px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded font-medium">{p.status} Error</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1"><Zap size={11} className="text-amber-400" /> LCP Target: â‰¤ 2.5s</p>
                <p className="text-slate-400">Largest Contentful Paint. Measures loading performance. Pages above threshold lose ad rank.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1"><MonitorSmartphone size={11} className="text-blue-400" /> Mobile Score: â‰¥ 90</p>
                <p className="text-slate-400">Google mobile-friendly test. Below 75 triggers Quality Score penalty on mobile devices.</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <p className="font-semibold text-slate-900 mb-1 flex items-center gap-1"><Globe size={11} className="text-purple-400" /> KW Relevance: â‰¥ 80%</p>
                <p className="text-slate-400">NLP check: target keyword in H1, title tag, meta description, and first 200 words of body.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

