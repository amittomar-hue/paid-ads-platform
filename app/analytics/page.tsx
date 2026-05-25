"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { KpiCard } from "@/components/ui/KpiCard";
import { PlatformBadge } from "@/components/ui/Badge";
import { MOCK_CAMPAIGNS, DAILY_CONVERSIONS, ATTRIBUTION_DATA } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPct } from "@/lib/utils";
import { BarChart3, TrendingUp, DollarSign, Target, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line
} from "recharts";

const TABS = ["Overview", "Google Ads", "LinkedIn Ads", "Audience Insights", "Creative Performance", "Budget Tracker", "Attribution"];

const PIE_COLORS = ["#4285f4", "#3b82f6", "#0077b5", "#0ea5e9", "#64748b"];

const AD_GROUPS = [
  { name: "Brand â€” Exact", campaign: "Brand Search â€” India", impressions: 18400, clicks: 920, ctr: 5.0, cpc: 8.2, conversions: 74, cpa: 101.9, qs: 9 },
  { name: "Competitor â€” Phrase", campaign: "Competitor Keywords", impressions: 24200, clicks: 484, ctr: 2.0, cpc: 19.4, conversions: 20, cpa: 470.0, qs: 5 },
  { name: "RLSA â€” Site Visitors", campaign: "Brand Search â€” India", impressions: 6800, clicks: 476, ctr: 7.0, cpc: 11.2, conversions: 45, cpa: 118.4, qs: 8 },
  { name: "Generic â€” Broad", campaign: "Performance Max", impressions: 52000, clicks: 1560, ctr: 3.0, cpc: 7.8, conversions: 102, cpa: 119.2, qs: 7 },
  { name: "Product â€” Exact", campaign: "Performance Max", impressions: 11200, clicks: 672, ctr: 6.0, cpc: 9.6, conversions: 58, cpa: 111.3, qs: 9 },
];

const SEARCH_IMP_SHARE = [
  { term: "ai marketing software", share: 72, lost_rank: 18, lost_budget: 10 },
  { term: "paid ads automation", share: 58, lost_rank: 28, lost_budget: 14 },
  { term: "google ads management", share: 34, lost_rank: 42, lost_budget: 24 },
  { term: "ppc tool india", share: 81, lost_rank: 12, lost_budget: 7 },
  { term: "ad optimization platform", share: 65, lost_rank: 22, lost_budget: 13 },
];

const LI_FORMATS = [
  { format: "Single Image", impressions: 42000, clicks: 924, ctr: 2.2, cpm: 18.4, cpl: 680, engagementRate: 3.1, leads: 28 },
  { format: "Carousel", impressions: 28000, clicks: 784, ctr: 2.8, cpm: 21.2, cpl: 520, engagementRate: 4.8, leads: 32 },
  { format: "Video (15s)", impressions: 18000, clicks: 432, ctr: 2.4, cpm: 24.6, cpl: 890, engagementRate: 6.2, videoViewRate: 48, leads: 14 },
  { format: "InMail", impressions: 8400, clicks: 336, ctr: 4.0, cpm: 42.1, cpl: 428, engagementRate: 8.6, leads: 22 },
  { format: "Conversation Ad", impressions: 6200, clicks: 217, ctr: 3.5, cpm: 36.8, cpl: 512, engagementRate: 7.1, leads: 18 },
];

const LI_AUDIENCE = [
  { segment: "SaaS Founders", leads: 42, cpl: 380, ctr: 4.8 },
  { segment: "VP Engineering", leads: 28, cpl: 520, ctr: 3.2 },
  { segment: "CTO / CIO", leads: 24, cpl: 612, ctr: 3.8 },
  { segment: "Marketing Directors", leads: 18, cpl: 720, ctr: 2.6 },
  { segment: "Growth Managers", leads: 12, cpl: 880, ctr: 2.1 },
];

const DEVICE_DATA = [
  { device: "Mobile", impressions: 62400, clicks: 1560, ctr: 2.5, conversions: 84, cpa: 182.4, share: 48 },
  { device: "Desktop", impressions: 52800, clicks: 1848, ctr: 3.5, conversions: 128, cpa: 124.8, share: 41 },
  { device: "Tablet", impressions: 14400, clicks: 288, ctr: 2.0, conversions: 16, cpa: 268.3, share: 11 },
];

const GEO_DATA = [
  { city: "Mumbai", spend: 28400, conversions: 86, cpa: 330.2, roas: 3.8 },
  { city: "Bangalore", spend: 24200, conversions: 96, cpa: 252.1, roas: 4.6 },
  { city: "Delhi NCR", spend: 18600, conversions: 62, cpa: 300.0, roas: 3.2 },
  { city: "Hyderabad", spend: 12400, conversions: 44, cpa: 281.8, roas: 3.9 },
  { city: "Pune", spend: 8200, conversions: 28, cpa: 292.9, roas: 3.5 },
  { city: "Chennai", spend: 6800, conversions: 22, cpa: 309.1, roas: 3.1 },
];

const HOURLY_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  label: h === 0 ? "12am" : h < 12 ? `${h}am` : h === 12 ? "12pm" : `${h - 12}pm`,
  conversions: [2, 1, 0, 0, 1, 2, 4, 8, 14, 18, 22, 20, 16, 14, 18, 24, 26, 22, 18, 14, 10, 8, 6, 4][h],
  cpa: [320, 380, 420, 460, 400, 340, 280, 220, 164, 142, 128, 138, 158, 168, 144, 122, 118, 132, 148, 162, 194, 218, 248, 284][h],
}));

const CREATIVES = [
  { id: "c1", type: "Headline", asset: "Cut Your Ad Spend by 40% with AI", campaign: "Brand Search", impressions: 28400, ctr: 4.8, cvr: 3.2, conversions: 44, status: "Top", fatigueScore: 12 },
  { id: "c2", type: "Headline", asset: "Automate Google & LinkedIn Ads", campaign: "Brand Search", impressions: 22000, ctr: 3.6, cvr: 2.8, conversions: 32, status: "Good", fatigueScore: 28 },
  { id: "c3", type: "Image", asset: "Dashboard-hero-v3.png", campaign: "Competitor KW", impressions: 18600, ctr: 2.4, cvr: 1.8, conversions: 16, status: "Declining", fatigueScore: 64 },
  { id: "c4", type: "Video", asset: "30s Product Demo Reel", campaign: "LinkedIn â€” SaaS", impressions: 14200, ctr: 2.8, cvr: 2.2, conversions: 18, status: "Good", fatigueScore: 34 },
  { id: "c5", type: "Headline", asset: "Free 14-Day Pilot â€” No Credit Card", campaign: "Performance Max", impressions: 38000, ctr: 5.2, cvr: 4.1, conversions: 86, status: "Top", fatigueScore: 8 },
  { id: "c6", type: "Description", asset: "Trusted by 200+ growth teams across India & SEA.", campaign: "Brand Search", impressions: 16400, ctr: 3.2, cvr: 2.4, conversions: 22, status: "Good", fatigueScore: 42 },
  { id: "c7", type: "Image", asset: "Social-proof-logos-v2.png", campaign: "LinkedIn â€” SaaS", impressions: 9800, ctr: 1.8, cvr: 1.2, conversions: 8, status: "Refresh", fatigueScore: 78 },
];

const DOW_DATA = [
  { day: "Mon", conversions: 48, cpa: 128, spend: 6144 },
  { day: "Tue", conversions: 52, cpa: 122, spend: 6344 },
  { day: "Wed", conversions: 58, cpa: 118, spend: 6844 },
  { day: "Thu", conversions: 62, cpa: 114, spend: 7068 },
  { day: "Fri", conversions: 54, cpa: 124, spend: 6696 },
  { day: "Sat", conversions: 28, cpa: 168, spend: 4704 },
  { day: "Sun", conversions: 22, cpa: 184, spend: 4048 },
];

const ATTRIBUTION_MODELS = [
  { name: "Last Click", google: 62, linkedin: 26, direct: 8, organic: 4 },
  { name: "First Click", google: 48, linkedin: 38, direct: 6, organic: 8 },
  { name: "Linear", google: 52, linkedin: 32, direct: 8, organic: 8 },
  { name: "Time Decay", google: 58, linkedin: 28, direct: 8, organic: 6 },
  { name: "Position-Based", google: 56, linkedin: 30, direct: 8, organic: 6 },
  { name: "Data-Driven", google: 54, linkedin: 34, direct: 7, organic: 5 },
  { name: "Custom (1.5x LI)", google: 48, linkedin: 42, direct: 6, organic: 4 },
];

const BUDGET_PACING = [
  { day: "May 1", planned: 4800, actual: 4620 },
  { day: "May 5", planned: 24000, actual: 23200 },
  { day: "May 10", planned: 48000, actual: 48800 },
  { day: "May 15", planned: 72000, actual: 74200 },
  { day: "May 20", planned: 96000, actual: 98600 },
  { day: "May 25", planned: 120000, actual: 122400 },
];

const CAMPAIGN_PACING = [
  { name: "Brand Search â€” India", budget: 48000, spent: 38400, pct: 80, forecast: 52800, status: "On Track" },
  { name: "Competitor Keywords", budget: 32000, spent: 28400, pct: 89, forecast: 36200, status: "Over-Pacing" },
  { name: "Performance Max", budget: 64000, spent: 44800, pct: 70, forecast: 58400, status: "Under-Pacing" },
  { name: "SaaS Decision Makers", budget: 28000, spent: 22400, pct: 80, forecast: 29800, status: "On Track" },
  { name: "Retargeting â€” All", budget: 16000, spent: 11200, pct: 70, forecast: 14800, status: "Under-Pacing" },
];

const fatigueColor = (score: number) =>
  score < 30 ? "text-emerald-400" : score < 60 ? "text-amber-400" : "text-red-400";
const statusBadge = (s: string) =>
  ({ Top: "bg-emerald-500/15 text-emerald-400", Good: "bg-blue-500/15 text-blue-400", Declining: "bg-amber-500/15 text-amber-400", Refresh: "bg-red-500/15 text-red-400" }[s] ?? "bg-slate-500/15 text-slate-400");
const pacingBadge = (s: string) =>
  ({ "On Track": "bg-emerald-500/15 text-emerald-400", "Over-Pacing": "bg-red-500/15 text-red-400", "Under-Pacing": "bg-amber-500/15 text-amber-400" }[s] ?? "bg-slate-500/15 text-slate-400");

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [platformFilter, setPlatformFilter] = useState<"all" | "google" | "linkedin">("all");

  const filtered = platformFilter === "all" ? MOCK_CAMPAIGNS : MOCK_CAMPAIGNS.filter((c) => c.platform === platformFilter);
  const totalSpend = filtered.reduce((s, c) => s + c.spend, 0);
  const totalConversions = filtered.reduce((s, c) => s + c.conversions, 0);
  const avgRoas = filtered.reduce((s, c) => s + c.roas, 0) / (filtered.length || 1);
  const avgCpa = totalSpend / (totalConversions || 1);

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Analytics" subtitle="Cross-platform performance reporting and attribution" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* Tab Bar */}
        <div className="flex flex-wrap gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${activeTab === t ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* KPIs â€” always visible */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Total Spend" value={formatCurrency(totalSpend, true)} change="12%" changePositive icon={DollarSign} iconColor="#10b981" />
          <KpiCard label="Conversions" value={formatNumber(totalConversions)} change="8.7%" changePositive icon={Target} iconColor="#8b5cf6" />
          <KpiCard label="Avg ROAS" value={`${avgRoas.toFixed(1)}x`} change="0.3x" changePositive icon={TrendingUp} iconColor="#f59e0b" />
          <KpiCard label="Avg CPA" value={formatCurrency(avgCpa)} change="â‚¹12" changePositive={false} icon={BarChart3} iconColor="#4285f4" />
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <>
            <Card>
              <CardHeader title="Daily Conversions by Platform" subtitle="Current week" />
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={DAILY_CONVERSIONS}>
                  <defs>
                    <linearGradient id="google" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4285f4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4285f4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="linkedin" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0077b5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0077b5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Area type="monotone" dataKey="google" name="Google Ads" stroke="#4285f4" fill="url(#google)" strokeWidth={2} />
                  <Area type="monotone" dataKey="linkedin" name="LinkedIn Ads" stroke="#0077b5" fill="url(#linkedin)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Campaign Performance</h3>
                  <p className="text-xs text-slate-500 mt-0.5">All-time metrics</p>
                </div>
                <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                  {(["all", "google", "linkedin"] as const).map((p) => (
                    <button key={p} onClick={() => setPlatformFilter(p)}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${platformFilter === p ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
                      {p === "all" ? "All" : p === "google" ? "Google" : "LinkedIn"}
                    </button>
                  ))}
                </div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-t border-b border-slate-200 bg-slate-50">
                    {["Campaign", "Spend", "Impressions", "Clicks", "CTR", "Conv.", "CPA", "ROAS"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 truncate max-w-[180px]">{c.name}</p>
                        <PlatformBadge platform={c.platform} />
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(c.spend, true)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatNumber(c.impressions, true)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatNumber(c.clicks, true)}</td>
                      <td className="px-4 py-3"><span className={c.ctr > 2.5 ? "text-emerald-400" : "text-slate-700"}>{formatPct(c.ctr)}</span></td>
                      <td className="px-4 py-3 text-slate-700">{c.conversions}</td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(c.cpa)}</td>
                      <td className="px-4 py-3">
                        <span className={c.roas >= 4 ? "text-emerald-400 font-semibold" : c.roas < 2.5 ? "text-red-400" : "text-slate-700"}>{c.roas.toFixed(1)}x</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        )}

        {/* Google Ads Tab */}
        {activeTab === "Google Ads" && (
          <>
            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Ad Group Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Drill-down by ad group â€” all Google campaigns</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-t border-b border-slate-200 bg-slate-50">
                    {["Ad Group", "Campaign", "Impr.", "Clicks", "CTR", "CPC", "Conv.", "CPA", "QS"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AD_GROUPS.map((ag, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{ag.name}</td>
                      <td className="px-4 py-3 text-slate-400 text-[11px] truncate max-w-[140px]">{ag.campaign}</td>
                      <td className="px-4 py-3 text-slate-700">{ag.impressions.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-slate-700">{ag.clicks.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3"><span className={ag.ctr > 3 ? "text-emerald-400" : ag.ctr < 2 ? "text-red-400" : "text-slate-700"}>{ag.ctr.toFixed(1)}%</span></td>
                      <td className="px-4 py-3 text-slate-700">â‚¹{ag.cpc}</td>
                      <td className="px-4 py-3 text-slate-700">{ag.conversions}</td>
                      <td className="px-4 py-3 text-slate-700">â‚¹{ag.cpa.toFixed(0)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-1.5 rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{ width: `${ag.qs * 10}%`, background: ag.qs >= 7 ? "#10b981" : ag.qs >= 4 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className={`font-semibold text-[11px] ${ag.qs >= 7 ? "text-emerald-400" : ag.qs >= 4 ? "text-amber-400" : "text-red-400"}`}>{ag.qs}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <CardHeader title="Search Impression Share" subtitle="How often your ads show vs eligible impressions" />
              <div className="space-y-3">
                {SEARCH_IMP_SHARE.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-slate-700">{s.term}</span>
                      <span className="text-xs font-semibold text-slate-900">{s.share}% share</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 flex overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${s.share}%` }} />
                      <div className="h-full bg-red-500/50" style={{ width: `${s.lost_rank}%` }} />
                      <div className="h-full bg-amber-500/40" style={{ width: `${s.lost_budget}%` }} />
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> Won</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500/60 inline-block" /> Lost (Rank) {s.lost_rank}%</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500/50 inline-block" /> Lost (Budget) {s.lost_budget}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* LinkedIn Ads Tab */}
        {activeTab === "LinkedIn Ads" && (
          <>
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: "Avg CTR", value: "2.98%", color: "#0077b5" },
                { label: "Avg CPL", value: "â‚¹604", color: "#10b981" },
                { label: "Avg CPM", value: "â‚¹28.6", color: "#8b5cf6" },
                { label: "Eng. Rate", value: "5.96%", color: "#f59e0b" },
                { label: "Video View Rate", value: "48%", color: "#ef4444" },
              ].map((m) => (
                <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Performance by Ad Format</h3>
                <p className="text-xs text-slate-500 mt-0.5">LinkedIn-specific metrics per format</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-t border-b border-slate-200 bg-slate-50">
                    {["Format", "Impressions", "Clicks", "CTR", "CPM", "CPL", "Eng. Rate", "Leads"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LI_FORMATS.map((f, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium">{f.format}</td>
                      <td className="px-4 py-3 text-slate-700">{f.impressions.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-slate-700">{f.clicks.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3"><span className={f.ctr > 3 ? "text-emerald-400" : "text-slate-700"}>{f.ctr.toFixed(1)}%</span></td>
                      <td className="px-4 py-3 text-slate-700">â‚¹{f.cpm}</td>
                      <td className="px-4 py-3 text-slate-700">â‚¹{f.cpl}</td>
                      <td className="px-4 py-3"><span className={f.engagementRate > 5 ? "text-emerald-400" : "text-slate-700"}>{f.engagementRate}%</span></td>
                      <td className="px-4 py-3 text-slate-900 font-semibold">{f.leads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <Card>
              <CardHeader title="Performance by Audience Segment" subtitle="LinkedIn targeting segments â€” CPL and conversion rate" />
              <div className="space-y-3">
                {LI_AUDIENCE.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-slate-900">{a.segment}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">CTR: {a.ctr}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-900">{a.leads} leads</p>
                      <p className="text-[10px] text-emerald-400">â‚¹{a.cpl} CPL</p>
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-[#0077b5]" style={{ width: `${(a.leads / 42) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Audience Insights Tab */}
        {activeTab === "Audience Insights" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Device Breakdown */}
              <Card>
                <CardHeader title="Device Breakdown" subtitle="Conversions and CPA by device type" />
                <div className="space-y-3">
                  {DEVICE_DATA.map((d) => (
                    <div key={d.device} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-slate-900">{d.device}</span>
                        <span className="text-[10px] text-slate-500">{d.share}% of impressions</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div><p className="text-xs font-semibold text-slate-900">{d.conversions}</p><p className="text-[10px] text-slate-500">Conv.</p></div>
                        <div><p className="text-xs font-semibold text-slate-900">{d.ctr}%</p><p className="text-[10px] text-slate-500">CTR</p></div>
                        <div><p className={`text-xs font-semibold ${d.cpa < 150 ? "text-emerald-400" : d.cpa > 250 ? "text-red-400" : "text-amber-400"}`}>â‚¹{d.cpa.toFixed(0)}</p><p className="text-[10px] text-slate-500">CPA</p></div>
                      </div>
                      <div className="w-full h-1 rounded-full bg-slate-100 mt-2">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${d.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Geographic Breakdown */}
              <Card>
                <CardHeader title="Geographic Performance" subtitle="Top cities by spend and ROAS" />
                <div className="space-y-2">
                  {GEO_DATA.map((g, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-bold text-slate-500 w-5">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-slate-900">{g.city}</p>
                        <p className="text-[10px] text-slate-500">Spend: {formatCurrency(g.spend, true)} Â· {g.conversions} conv.</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold ${g.roas >= 4 ? "text-emerald-400" : "text-amber-400"}`}>{g.roas}x ROAS</p>
                        <p className="text-[10px] text-slate-500">â‚¹{g.cpa.toFixed(0)} CPA</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Hour-of-Day Performance */}
            <Card>
              <CardHeader title="Hour-of-Day Performance" subtitle="Conversions and CPA by hour â€” use to set ad scheduling" />
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={HOURLY_DATA} barSize={10}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false}
                    interval={2} />
                  <YAxis yAxisId="left" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 11 }} />
                  <Bar yAxisId="left" dataKey="conversions" name="Conversions" fill="#4285f4" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="p-2 rounded bg-emerald-500/8 border border-emerald-500/15">
                  <p className="text-xs font-semibold text-emerald-400">Peak Hours</p>
                  <p className="text-[10px] text-slate-400">3â€“6 PM (highest conv.)</p>
                </div>
                <div className="p-2 rounded bg-red-500/8 border border-red-500/15">
                  <p className="text-xs font-semibold text-red-400">Dead Hours</p>
                  <p className="text-[10px] text-slate-400">12 AMâ€“5 AM (0 conv.)</p>
                </div>
                <div className="p-2 rounded bg-blue-500/8 border border-blue-500/15">
                  <p className="text-xs font-semibold text-blue-400">Recommended</p>
                  <p className="text-[10px] text-slate-400">Reduce bids 9 PMâ€“6 AM</p>
                </div>
              </div>
            </Card>

            {/* Day of Week */}
            <Card>
              <CardHeader title="Day-of-Week Performance" subtitle="Conversions and CPA by day â€” use to set day-parting bid adjustments" />
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={DOW_DATA} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12 }} />
                  <Bar dataKey="conversions" name="Conversions" radius={[3, 3, 0, 0]}>
                    {DOW_DATA.map((d, i) => (
                      <Cell key={i} fill={d.day === "Sat" || d.day === "Sun" ? "#f59e0b" : "#4285f4"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-7 gap-1 mt-3">
                {DOW_DATA.map((d) => (
                  <div key={d.day} className="text-center">
                    <p className={`text-[10px] font-semibold ${d.day === "Wed" || d.day === "Thu" ? "text-emerald-400" : d.day === "Sat" || d.day === "Sun" ? "text-amber-400" : "text-slate-700"}`}>{d.day}</p>
                    <p className="text-[10px] text-slate-500">â‚¹{d.cpa} CPA</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
                <span><span className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-1" />Weekday</span>
                <span><span className="w-2 h-2 rounded-full bg-amber-500 inline-block mr-1" />Weekend (âˆ’40% budget recommended for LinkedIn)</span>
              </div>
            </Card>
          </>
        )}

        {/* Creative Performance Tab */}
        {activeTab === "Creative Performance" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Top Assets", value: CREATIVES.filter(c => c.status === "Top").length.toString(), color: "#10b981" },
                { label: "Declining Assets", value: CREATIVES.filter(c => c.status === "Declining" || c.status === "Refresh").length.toString(), color: "#f59e0b" },
                { label: "Avg Fatigue Score", value: Math.round(CREATIVES.reduce((s, c) => s + c.fatigueScore, 0) / CREATIVES.length).toString(), color: "#8b5cf6" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Asset-Level Performance</h3>
                <p className="text-xs text-slate-500 mt-0.5">Headlines, images, and video assets with CTR, CVR, and fatigue indicators</p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-t border-b border-slate-200 bg-slate-50">
                    {["Asset", "Type", "Campaign", "Impressions", "CTR", "CVR", "Conv.", "Fatigue", "Status"].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CREATIVES.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-900 font-medium max-w-[220px]">
                        <p className="truncate">{c.asset}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">{c.type}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-[11px] truncate max-w-[140px]">{c.campaign}</td>
                      <td className="px-4 py-3 text-slate-700">{c.impressions.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3"><span className={c.ctr > 4 ? "text-emerald-400" : c.ctr < 2.5 ? "text-red-400" : "text-slate-700"}>{c.ctr}%</span></td>
                      <td className="px-4 py-3"><span className={c.cvr > 3 ? "text-emerald-400" : "text-slate-700"}>{c.cvr}%</span></td>
                      <td className="px-4 py-3 text-slate-900 font-semibold">{c.conversions}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{ width: `${c.fatigueScore}%`, background: c.fatigueScore < 30 ? "#10b981" : c.fatigueScore < 60 ? "#f59e0b" : "#ef4444" }} />
                          </div>
                          <span className={`text-[10px] font-semibold ${fatigueColor(c.fatigueScore)}`}>{c.fatigueScore}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusBadge(c.status)}`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-amber-400">2 assets need refreshing</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    &quot;Dashboard-hero-v3.png&quot; (fatigue 64) and &quot;Social-proof-logos-v2.png&quot; (fatigue 78) are showing creative fatigue.
                    CTR has declined 22% over the last 14 days. Upload new variants to maintain performance.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Budget Tracker Tab */}
        {activeTab === "Budget Tracker" && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "May Actual Spend", value: "â‚¹1.22L", sub: "of â‚¹1.88L monthly budget", color: "#4285f4" },
                { label: "Month-End Forecast", value: "â‚¹1.94L", sub: "+3.2% over budget", color: "#f59e0b" },
                { label: "Days Remaining", value: "6", sub: "Budget burn rate: â‚¹4,880/day", color: "#10b981" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            <Card>
              <CardHeader title="Daily Spend: Actual vs Planned" subtitle="Cumulative spend pacing through May 2026" />
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={BUDGET_PACING}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => `â‚¹${(v / 1000).toFixed(0)}K`} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => `â‚¹${Number(v).toLocaleString("en-IN")}`}
                    contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, color: "#0f172a", fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  <Line type="monotone" dataKey="planned" name="Planned" stroke="#64748b" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  <Line type="monotone" dataKey="actual" name="Actual" stroke="#4285f4" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-0 overflow-hidden">
              <div className="px-5 pt-5 pb-3">
                <h3 className="text-sm font-semibold text-slate-900">Campaign Budget Utilisation</h3>
                <p className="text-xs text-slate-500 mt-0.5">Spend pacing vs plan â€” end-of-month forecast</p>
              </div>
              <div className="px-5 pb-5 space-y-3">
                {CAMPAIGN_PACING.map((c, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-slate-900">{c.name}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${pacingBadge(c.status)}`}>{c.status}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="w-full h-2 rounded-full bg-slate-100">
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min(c.pct, 100)}%`,
                            background: c.pct > 90 ? "#ef4444" : c.pct < 75 ? "#f59e0b" : "#10b981"
                          }} />
                        </div>
                      </div>
                      <span className="text-xs text-slate-700 w-8 text-right">{c.pct}%</span>
                      <div className="text-right ml-2">
                        <p className="text-[10px] text-slate-500">â‚¹{(c.spent / 1000).toFixed(0)}K / â‚¹{(c.budget / 1000).toFixed(0)}K</p>
                        <p className="text-[10px] text-slate-400">Forecast: â‚¹{(c.forecast / 1000).toFixed(0)}K</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Attribution Tab */}
        {activeTab === "Attribution" && (
          <>
            {/* Model selector + pie */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader title="Multi-Touch Attribution" subtitle="Conversion share by channel â€” Last Click model" />
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={ATTRIBUTION_DATA} dataKey="share" nameKey="channel" cx="50%" cy="50%" outerRadius={95} innerRadius={55} paddingAngle={2}>
                      {ATTRIBUTION_DATA.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 8, fontSize: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11, color: "#64748b" }} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
              <Card>
                <CardHeader title="Revenue by Channel" />
                <div className="space-y-3">
                  {ATTRIBUTION_DATA.map((a, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-700">{a.channel}</span>
                        <span className="text-xs font-semibold text-slate-900">{formatCurrency(a.revenue, true)}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100">
                        <div className="h-full rounded-full" style={{ width: `${a.share}%`, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-slate-500">{a.conversions} conversions</span>
                        <span className="text-[10px] text-slate-500">{a.share}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* All 7 models comparison */}
            <Card>
              <CardHeader title="Attribution Model Comparison" subtitle="How credit is distributed across channels under each model â€” highlights which model best reflects your funnel" />
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left pb-3 text-slate-500 font-medium pr-6">Attribution Model</th>
                      <th className="text-left pb-3 text-slate-500 font-medium pr-4">Google Ads</th>
                      <th className="text-left pb-3 text-slate-500 font-medium pr-4">LinkedIn Ads</th>
                      <th className="text-left pb-3 text-slate-500 font-medium pr-4">Direct</th>
                      <th className="text-left pb-3 text-slate-500 font-medium">Organic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ATTRIBUTION_MODELS.map((m, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-3 pr-6">
                          <p className="font-medium text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {m.name === "Last Click" && "Simple. Undervalues awareness channels."}
                            {m.name === "First Click" && "Highlights discovery. Undervalues closers."}
                            {m.name === "Linear" && "Equal credit to all touchpoints."}
                            {m.name === "Time Decay" && "More credit to recent touches. Good for short cycles."}
                            {m.name === "Position-Based" && "40% first + 40% last + 20% middle. B2B recommended."}
                            {m.name === "Data-Driven" && "ML-based fractional credit. Requires 500+ conv/month."}
                            {m.name === "Custom (1.5x LI)" && "LinkedIn boosted 1.5x for influenced pipeline deals."}
                          </p>
                        </td>
                        {[{ v: m.google, color: "#4285f4" }, { v: m.linkedin, color: "#0077b5" }, { v: m.direct, color: "#10b981" }, { v: m.organic, color: "#8b5cf6" }].map((col, j) => (
                          <td key={j} className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 rounded-full bg-slate-100">
                                <div className="h-full rounded-full" style={{ width: `${col.v}%`, background: col.color }} />
                              </div>
                              <span className="text-slate-900 font-medium w-8">{col.v}%</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-blue-500/8 border border-blue-500/15 text-[11px] text-slate-400">
                <span className="text-blue-400 font-semibold">Recommendation: </span>
                Use <strong className="text-slate-900">Position-Based</strong> as your primary model for B2B decision cycles â€” it gives equal weight to brand discovery (LinkedIn) and intent-driven conversion (Google). Switch to <strong className="text-slate-900">Data-Driven</strong> once you cross 500 conversions/month.
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}



