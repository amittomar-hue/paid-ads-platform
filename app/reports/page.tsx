"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/Badge";
import { FileText, Download, Plus, Trash2, BarChart3, Eye, CheckSquare, Square } from "lucide-react";

const ALL_METRICS = [
  { id: "impressions", label: "Impressions", group: "Reach" },
  { id: "clicks", label: "Clicks", group: "Reach" },
  { id: "ctr", label: "CTR", group: "Reach" },
  { id: "spend", label: "Spend", group: "Cost" },
  { id: "cpc", label: "CPC", group: "Cost" },
  { id: "cpm", label: "CPM", group: "Cost" },
  { id: "conversions", label: "Conversions", group: "Performance" },
  { id: "cpa", label: "CPA", group: "Performance" },
  { id: "cvr", label: "Conv. Rate", group: "Performance" },
  { id: "roas", label: "ROAS", group: "Performance" },
  { id: "revenue", label: "Revenue", group: "Performance" },
  { id: "quality_score", label: "Quality Score", group: "Quality" },
  { id: "engagement_rate", label: "Engagement Rate", group: "Quality" },
  { id: "video_view_rate", label: "Video View Rate", group: "Quality" },
];

const ALL_DIMENSIONS = [
  { id: "campaign", label: "Campaign" },
  { id: "platform", label: "Platform" },
  { id: "ad_group", label: "Ad Group" },
  { id: "ad_format", label: "Ad Format" },
  { id: "date", label: "Date" },
  { id: "device", label: "Device" },
  { id: "geo", label: "Geography" },
];

const SAVED_REPORTS = [
  { id: "r1", name: "Monthly Executive Summary", metrics: ["spend", "conversions", "roas", "cpa"], dimensions: ["platform", "campaign"], platform: "both", dateRange: "Last 30 days", lastRun: "2026-05-20" },
  { id: "r2", name: "Weekly Google Ads KPIs", metrics: ["impressions", "clicks", "ctr", "cpc", "conversions"], dimensions: ["campaign", "ad_group"], platform: "google", dateRange: "Last 7 days", lastRun: "2026-05-24" },
  { id: "r3", name: "LinkedIn Lead Gen Report", metrics: ["impressions", "cpm", "cpl", "conversions", "engagement_rate"], dimensions: ["ad_format", "date"], platform: "linkedin", dateRange: "Last 14 days", lastRun: "2026-05-22" },
];

const PREVIEW_DATA = [
  { campaign: "Brand Search â€” India", platform: "google", spend: "â‚¹38,400", impressions: "18,400", clicks: "920", ctr: "5.0%", conversions: "74", cpa: "â‚¹519", roas: "4.2x" },
  { campaign: "Competitor Keywords", platform: "google", spend: "â‚¹28,400", impressions: "24,200", clicks: "484", ctr: "2.0%", conversions: "20", cpa: "â‚¹1,420", roas: "2.1x" },
  { campaign: "Performance Max", platform: "google", spend: "â‚¹44,800", impressions: "63,200", clicks: "2,232", ctr: "3.5%", conversions: "160", cpa: "â‚¹280", roas: "4.8x" },
  { campaign: "SaaS Decision Makers", platform: "linkedin", spend: "â‚¹22,400", impressions: "28,000", clicks: "784", ctr: "2.8%", conversions: "32", cpa: "â‚¹700", roas: "3.2x" },
  { campaign: "Retargeting â€” All", platform: "linkedin", spend: "â‚¹11,200", impressions: "14,600", clicks: "438", ctr: "3.0%", conversions: "22", cpa: "â‚¹509", roas: "3.6x" },
];

const METRIC_GROUPS = ["Reach", "Cost", "Performance", "Quality"];

export default function ReportsPage() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["spend", "impressions", "clicks", "ctr", "conversions", "cpa", "roas"]);
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(["campaign", "platform"]);
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [platform, setPlatform] = useState<"all" | "google" | "linkedin">("all");
  const [showPreview, setShowPreview] = useState(false);
  const [view, setView] = useState<"builder" | "saved">("builder");

  function toggleMetric(id: string) {
    setSelectedMetrics((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
  }
  function toggleDimension(id: string) {
    setSelectedDimensions((prev) => prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]);
  }

  const previewCols = ["campaign", "platform", ...selectedMetrics.filter((m) => ["spend", "impressions", "clicks", "ctr", "conversions", "cpa", "roas"].includes(m))];
  const filteredPreview = platform === "all" ? PREVIEW_DATA : PREVIEW_DATA.filter((r) => r.platform === platform);

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Custom Report Builder" subtitle="Select metrics, dimensions, and date ranges â€” export as CSV or PDF" />

      <div className="flex-1 p-6 overflow-y-auto space-y-5">
        {/* View Toggle */}
        <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200 w-fit">
          {(["builder", "saved"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors capitalize flex items-center gap-1.5 ${view === v ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
              {v === "builder" ? <Plus size={12} /> : <FileText size={12} />}
              {v === "builder" ? "Report Builder" : "Saved Reports"}
            </button>
          ))}
        </div>

        {view === "saved" && (
          <div className="space-y-3">
            {SAVED_REPORTS.map((r) => (
              <Card key={r.id} hover>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                    <BarChart3 size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{r.metrics.length} metrics</span>
                      <span>Â·</span>
                      <span>{r.dimensions.join(", ")}</span>
                      <span>Â·</span>
                      <span>{r.dateRange}</span>
                      <span>Â·</span>
                      <span>Last run: {r.lastRun}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {r.metrics.slice(0, 5).map((m) => (
                        <span key={m} className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">{ALL_METRICS.find((x) => x.id === m)?.label}</span>
                      ))}
                      {r.metrics.length > 5 && <span className="text-[10px] text-slate-500">+{r.metrics.length - 5}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {r.platform !== "both" && <PlatformBadge platform={r.platform as "google" | "linkedin"} />}
                    <Button variant="outline" size="sm"><Eye size={12} /> Run</Button>
                    <Button variant="outline" size="sm"><Download size={12} /> Export</Button>
                    <button className="text-slate-500 hover:text-red-400 transition-colors p-1">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {view === "builder" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Metric Selector */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader title="Select Metrics" subtitle={`${selectedMetrics.length} selected`} />
                  {METRIC_GROUPS.map((group) => (
                    <div key={group} className="mb-4">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">{group}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ALL_METRICS.filter((m) => m.group === group).map((m) => {
                          const selected = selectedMetrics.includes(m.id);
                          return (
                            <button key={m.id} onClick={() => toggleMetric(m.id)}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-colors ${selected ? "border-blue-500/40 bg-blue-500/10 text-blue-300" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-200"}`}>
                              {selected ? <CheckSquare size={12} className="text-blue-400 flex-shrink-0" /> : <Square size={12} className="flex-shrink-0" />}
                              {m.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </Card>

                <Card>
                  <CardHeader title="Select Dimensions" subtitle="Group data by these fields" />
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_DIMENSIONS.map((d) => {
                      const selected = selectedDimensions.includes(d.id);
                      return (
                        <button key={d.id} onClick={() => toggleDimension(d.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs transition-colors ${selected ? "border-purple-500/40 bg-purple-500/10 text-purple-300" : "border-slate-200 bg-slate-50 text-slate-400 hover:border-slate-200"}`}>
                          {selected ? <CheckSquare size={12} className="text-purple-400 flex-shrink-0" /> : <Square size={12} className="flex-shrink-0" />}
                          {d.label}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Report Config */}
              <div className="space-y-4">
                <Card>
                  <CardHeader title="Report Settings" />
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Date Range</label>
                      <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                        className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500/60">
                        <option>Today</option>
                        <option>Last 7 days</option>
                        <option>Last 14 days</option>
                        <option>Last 30 days</option>
                        <option>This month</option>
                        <option>Last month</option>
                        <option>Last 90 days</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
                      <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        {(["all", "google", "linkedin"] as const).map((p) => (
                          <button key={p} onClick={() => setPlatform(p)}
                            className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors capitalize ${platform === p ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
                            {p === "all" ? "All" : p === "google" ? "Google" : "LinkedIn"}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">Report Name</label>
                      <input className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500/60"
                        placeholder="e.g. May Performance Report" />
                    </div>
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Summary" />
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Metrics</span>
                      <span className="text-slate-900 font-medium">{selectedMetrics.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensions</span>
                      <span className="text-slate-900 font-medium">{selectedDimensions.length} selected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date Range</span>
                      <span className="text-slate-900 font-medium">{dateRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Platform</span>
                      <span className="text-slate-900 font-medium capitalize">{platform}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Est. rows</span>
                      <span className="text-slate-900 font-medium">{filteredPreview.length} campaigns</span>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4">
                    <Button variant="primary" size="sm" className="w-full" onClick={() => setShowPreview(true)}>
                      <Eye size={13} /> Preview Report
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm"><Download size={12} /> CSV</Button>
                      <Button variant="outline" size="sm"><FileText size={12} /> PDF</Button>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">Save Report</Button>
                  </div>
                </Card>
              </div>
            </div>

            {/* Preview Table */}
            {showPreview && (
              <Card className="p-0 overflow-hidden">
                <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Report Preview</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{dateRange} Â· {filteredPreview.length} rows</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm"><Download size={12} /> Export CSV</Button>
                    <Button variant="outline" size="sm"><FileText size={12} /> Export PDF</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-t border-b border-slate-200 bg-slate-50">
                        <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Campaign</th>
                        <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Platform</th>
                        {selectedMetrics.includes("spend") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Spend</th>}
                        {selectedMetrics.includes("impressions") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Impressions</th>}
                        {selectedMetrics.includes("clicks") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Clicks</th>}
                        {selectedMetrics.includes("ctr") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">CTR</th>}
                        {selectedMetrics.includes("conversions") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Conv.</th>}
                        {selectedMetrics.includes("cpa") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">CPA</th>}
                        {selectedMetrics.includes("roas") && <th className="text-left px-4 py-2.5 text-slate-500 font-medium">ROAS</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPreview.map((row, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-slate-900 font-medium truncate max-w-[200px]">{row.campaign}</td>
                          <td className="px-4 py-3"><PlatformBadge platform={row.platform as "google" | "linkedin"} /></td>
                          {selectedMetrics.includes("spend") && <td className="px-4 py-3 text-slate-700">{row.spend}</td>}
                          {selectedMetrics.includes("impressions") && <td className="px-4 py-3 text-slate-700">{row.impressions}</td>}
                          {selectedMetrics.includes("clicks") && <td className="px-4 py-3 text-slate-700">{row.clicks}</td>}
                          {selectedMetrics.includes("ctr") && <td className="px-4 py-3"><span className={parseFloat(row.ctr) > 3 ? "text-emerald-400" : "text-slate-700"}>{row.ctr}</span></td>}
                          {selectedMetrics.includes("conversions") && <td className="px-4 py-3 text-slate-700">{row.conversions}</td>}
                          {selectedMetrics.includes("cpa") && <td className="px-4 py-3 text-slate-700">{row.cpa}</td>}
                          {selectedMetrics.includes("roas") && <td className="px-4 py-3"><span className={parseFloat(row.roas) >= 4 ? "text-emerald-400 font-semibold" : "text-slate-700"}>{row.roas}</span></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

