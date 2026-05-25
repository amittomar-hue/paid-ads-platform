"use client";

import { useEffect, useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/Button";
import { PlatformBadge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPct, statusColor } from "@/lib/utils";
import { Plus, Search, TrendingUp, TrendingDown, Link2, AlertCircle, RefreshCw, Loader2, Upload, X, FileSpreadsheet } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { Campaign } from "@/lib/types";

function parseGoogleAdsCsv(text: string): Campaign[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  // Find the header row — Google Ads CSVs have metadata rows at the top
  const headerIdx = lines.findIndex((l) =>
    l.toLowerCase().includes("campaign") && (l.toLowerCase().includes("cost") || l.toLowerCase().includes("impressions") || l.toLowerCase().includes("clicks"))
  );
  if (headerIdx === -1) return [];

  const headers = lines[headerIdx].split(",").map((h) => h.replace(/"/g, "").trim().toLowerCase());

  const col = (row: string[], name: string) => {
    const idx = headers.findIndex((h) => h.includes(name));
    return idx >= 0 ? row[idx]?.replace(/"/g, "").replace(/,/g, "").trim() : "";
  };

  const toNum = (v: string) => parseFloat(v.replace(/[^0-9.-]/g, "")) || 0;

  const rows = lines.slice(headerIdx + 1).filter((l) => !l.startsWith("Total") && !l.startsWith('"Total'));

  return rows.map((line, i) => {
    const row = line.split(",");
    const name = col(row, "campaign") || `Campaign ${i + 1}`;
    const statusRaw = col(row, "status") || col(row, "campaign state") || "active";
    const status: Campaign["status"] =
      statusRaw.toLowerCase().includes("enabl") || statusRaw.toLowerCase() === "active" ? "Active"
      : statusRaw.toLowerCase().includes("paus") ? "Paused" : "Draft";

    const spend = toNum(col(row, "cost") || col(row, "spend"));
    const impressions = toNum(col(row, "impr"));
    const clicks = toNum(col(row, "click"));
    const ctr = toNum(col(row, "ctr")) || (impressions > 0 ? (clicks / impressions) * 100 : 0);
    const conversions = toNum(col(row, "conv"));
    const cpa = toNum(col(row, "cost / conv") || col(row, "cpa")) || (conversions > 0 ? spend / conversions : 0);
    const convValue = toNum(col(row, "conv. value") || col(row, "value"));
    const roas = toNum(col(row, "roas")) || (spend > 0 && convValue > 0 ? convValue / spend : 0);
    const budget = toNum(col(row, "budget") || col(row, "daily budget"));

    return {
      id: `csv_${i}`,
      platform: "google" as const,
      name,
      status,
      type: col(row, "campaign type") || "Search",
      objective: "Conversions",
      budget_daily: budget,
      budget_total: budget * 30,
      spend,
      impressions,
      clicks,
      ctr,
      cpc: clicks > 0 ? spend / clicks : 0,
      conversions,
      cpa,
      roas,
      quality_score: 70,
      start_date: new Date().toISOString().split("T")[0],
    };
  }).filter((c) => c.name && c.impressions + c.clicks + c.spend > 0);
}

const AD_EXTENSIONS = [
  { type: "Sitelink Extensions", action: "Auto-generate from top-traffic pages. Test 8 variants, surface 4 best performers.", status: "active", count: 8 },
  { type: "Callout Extensions", action: "Generate USP statements from brand guidelines. Rotate 10 callouts, keep 4 top CTR.", status: "active", count: 10 },
  { type: "Structured Snippets", action: "Auto-populate from product catalogue. Headers matched to business category.", status: "active", count: 6 },
  { type: "Call Extensions", action: "Track call conversions. Pause outside business hours automatically.", status: "active", count: 1 },
  { type: "Location Extensions", action: "Link to Google Business Profile. Enable location bid adjustments.", status: "active", count: 1 },
  { type: "Price Extensions", action: "Populate from product feed. Auto-update prices daily via feed sync.", status: "inactive", count: 0 },
  { type: "Promotion Extensions", action: "Activate during sale periods (calendar-driven). Auto-expire on end date.", status: "inactive", count: 0 },
  { type: "Image Extensions", action: "Upload product images from catalogue. Rotate and test click rates.", status: "active", count: 12 },
  { type: "Lead Form Extensions", action: "Create Google Lead Forms for lead-gen campaigns. Sync submissions to CRM.", status: "active", count: 3 },
  { type: "App Extensions", action: "Link to App Store / Play Store for app campaigns.", status: "inactive", count: 0 },
];

export default function CampaignsPage() {
  const [tab, setTab] = useState<"Campaigns" | "Extensions">("Campaigns");
  const [search, setSearch] = useState("");
  const [platformFilter, setPlatformFilter] = useState<"all" | "google" | "linkedin">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [dataSource, setDataSource] = useState<"mock" | "live" | "csv" | "loading">("loading");
  const [apiError, setApiError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function loadCampaigns() {
    setDataSource("loading");
    setApiError(null);
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.source === "live" && data.campaigns?.length > 0) {
        setCampaigns(data.campaigns);
        setDataSource("live");
      } else {
        setCampaigns(MOCK_CAMPAIGNS);
        setDataSource("mock");
        if (data.error) setApiError(data.error);
      }
    } catch {
      setCampaigns(MOCK_CAMPAIGNS);
      setDataSource("mock");
    }
  }

  useEffect(() => { loadCampaigns(); }, []);

  function handleCsvUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvError(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseGoogleAdsCsv(text);
      if (parsed.length === 0) {
        setCsvError("Could not parse this CSV. Make sure it's a Google Ads campaign report (Campaigns tab → Download).");
        return;
      }
      setCampaigns(parsed);
      setDataSource("csv");
      setShowImport(false);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (platformFilter !== "all" && c.platform !== platformFilter) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    return true;
  });

  const activeCount = campaigns.filter((c) => c.status === "Active").length;

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Campaigns"
        subtitle={`${campaigns.length} total · ${activeCount} active`}
        action={
          <div className="flex items-center gap-2">
            <button onClick={loadCampaigns} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Refresh">
              <RefreshCw size={13} className={dataSource === "loading" ? "animate-spin" : ""} />
            </button>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Upload size={13} /> Import CSV
            </Button>
            <Link href="/campaigns/create">
              <Button variant="primary" size="sm">
                <Plus size={13} /> New Campaign
              </Button>
            </Link>
          </div>
        }
      />

      <div className="flex-1 p-6 space-y-5 overflow-y-auto">

        {/* CSV Import Modal */}
        {showImport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md mx-4 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={18} className="text-blue-500" />
                  <h3 className="text-sm font-semibold text-slate-900">Import Google Ads CSV</h3>
                </div>
                <button onClick={() => { setShowImport(false); setCsvError(null); }} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-600 mb-5">
                <p className="font-medium text-slate-700">How to export from Google Ads:</p>
                <ol className="space-y-1.5 list-none">
                  {[
                    "Open Google Ads and go to Campaigns",
                    'Click the download icon (↓) at the top right of the table',
                    'Choose "CSV" format',
                    "Upload that file here",
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />

              {csvError && <p className="text-[11px] text-red-500 mb-3">{csvError}</p>}

              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload size={20} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-500">Click to choose your CSV file</span>
              </button>
            </div>
          </div>
        )}

        {/* Demo data banner */}
        {dataSource === "mock" && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200">
            <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-700">Showing demo data</p>
              <p className="text-[11px] text-amber-600 mt-0.5">
                {apiError
                  ? `Google Ads API: ${apiError}`
                  : "Connect your Google Ads account in the sidebar and add your Developer Token to .env.local to see live campaigns."}
              </p>
            </div>
            <Link href="/settings" className="text-[10px] font-semibold text-amber-600 hover:text-amber-800 whitespace-nowrap">
              Go to Settings →
            </Link>
          </div>
        )}

        {dataSource === "live" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-medium text-emerald-700">Live Google Ads data · Last synced just now</p>
          </div>
        )}

        {dataSource === "csv" && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200">
            <FileSpreadsheet size={14} className="text-blue-500 flex-shrink-0" />
            <p className="text-xs font-medium text-blue-700 flex-1">Showing data from your imported CSV · {campaigns.length} campaigns loaded</p>
            <button onClick={() => { setCampaigns(MOCK_CAMPAIGNS); setDataSource("mock"); }} className="text-[10px] text-blue-500 hover:text-blue-700 font-medium">
              Clear
            </button>
          </div>
        )}

        {dataSource === "loading" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <Loader2 size={12} className="text-slate-400 animate-spin" />
            <p className="text-xs text-slate-500">Fetching campaigns…</p>
          </div>
        )}

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 border border-slate-200 w-fit">
          {(["Campaigns", "Extensions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Extensions" && (
          <div className="space-y-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Link2 size={15} className="text-blue-500" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Ad Extensions (§4.6)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Automated extension management across all active campaigns</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AD_EXTENSIONS.map((ext) => (
                  <div key={ext.type} className={`p-4 rounded-xl border ${ext.status === "active" ? "bg-white border-slate-200" : "bg-slate-50 border-slate-100 opacity-70"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-xs font-semibold text-slate-900">{ext.type}</p>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ext.count > 0 && (
                          <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">{ext.count}</span>
                        )}
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${ext.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                          {ext.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{ext.action}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === "Campaigns" && (
          <>
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
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${platformFilter === p ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
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
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${statusFilter === s ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}
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
                    {["Campaign", "Platform", "Status", "Budget/Day", "Spend", "Impressions", "CTR", "Conversions", "CPA", "ROAS", "QS"].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-slate-500 font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900">{c.name}</p>
                          <p className="text-slate-500 text-[10px] mt-0.5">{c.type} · {c.objective}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3"><PlatformBadge platform={c.platform} /></td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColor(c.status)}`}>{c.status}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(c.budget_daily)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(c.spend, true)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatNumber(c.impressions, true)}</td>
                      <td className="px-4 py-3">
                        <span className={c.ctr > 2.5 ? "text-emerald-500" : c.ctr < 1.5 ? "text-red-400" : "text-slate-700"}>
                          {formatPct(c.ctr)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{formatNumber(c.conversions)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatCurrency(c.cpa)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {c.roas >= 4 ? <TrendingUp size={11} className="text-emerald-500" /> : c.roas < 2.5 ? <TrendingDown size={11} className="text-red-400" /> : null}
                          <span className={c.roas >= 4 ? "text-emerald-500 font-semibold" : c.roas < 2.5 ? "text-red-400" : "text-slate-700"}>
                            {c.roas.toFixed(1)}x
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-1.5 rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{
                              width: `${c.quality_score}%`,
                              background: c.quality_score >= 70 ? "#10b981" : c.quality_score >= 50 ? "#f59e0b" : "#ef4444",
                            }} />
                          </div>
                          <span className={c.quality_score >= 70 ? "text-emerald-500" : c.quality_score >= 50 ? "text-amber-500" : "text-red-400"}>
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
          </>
        )}
      </div>
    </div>
  );
}
