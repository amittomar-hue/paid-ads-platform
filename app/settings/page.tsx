"use client";

import { useState } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle, Bell, Shield, Calendar, Plus, Trash2 } from "lucide-react";

const TABS = ["API Connections", "AI Settings", "Notifications", "Scheduled Reports", "Security", "Deploy Guide"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("API Connections");
  const [googleKey, setGoogleKey] = useState("");
  const [linkedinKey, setLinkedinKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [schedules, setSchedules] = useState([
    { id: "s1", name: "Weekly Performance Digest", frequency: "Weekly", day: "Monday", time: "08:00", recipients: "team@company.com", format: "PDF", active: true },
    { id: "s2", name: "Daily Spend Summary", frequency: "Daily", day: "â€”", time: "07:00", recipients: "finance@company.com", format: "CSV", active: true },
    { id: "s3", name: "Monthly Attribution Report", frequency: "Monthly", day: "1st", time: "09:00", recipients: "cmo@company.com", format: "PDF", active: false },
  ]);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1">
      <TopBar title="Settings" subtitle="API connections, AI configuration, and deployment" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-slate-50 rounded-lg p-1 border border-slate-200">
            {TABS.map((t) => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${activeTab === t ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-700"}`}>
                {t}
              </button>
            ))}
          </div>

          {activeTab === "API Connections" && (
            <div className="space-y-4">
              <Card>
                <CardHeader title="Google Ads API" subtitle="Connect your Google Ads account" action={<span className="text-[10px] text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">Not Connected</span>} />
                <div className="space-y-3">
                  <Input label="Developer Token" type="password" value={googleKey} onChange={(e) => setGoogleKey(e.target.value)} placeholder="Enter Google Ads Developer Token" hint="Found in Google Ads â†’ Tools â†’ API Center" />
                  <Input label="Customer ID" placeholder="123-456-7890" />
                  <Input label="OAuth Client ID" placeholder="your-client-id.apps.googleusercontent.com" />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={save}>
                      {saved ? <><CheckCircle size={13} /> Saved</> : "Save Credentials"}
                    </Button>
                    <Button variant="outline" size="sm">Test Connection</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="LinkedIn Marketing API" subtitle="Connect your LinkedIn Ads account" action={<span className="text-[10px] text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">Not Connected</span>} />
                <div className="space-y-3">
                  <Input label="Client ID" value={linkedinKey} onChange={(e) => setLinkedinKey(e.target.value)} placeholder="LinkedIn App Client ID" />
                  <Input label="Client Secret" type="password" placeholder="LinkedIn App Client Secret" />
                  <Input label="Ad Account ID" placeholder="urn:li:sponsoredAccount:123456" />
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" onClick={save}>
                      {saved ? <><CheckCircle size={13} /> Saved</> : "Save Credentials"}
                    </Button>
                    <Button variant="outline" size="sm">Test Connection</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader title="Anthropic API" subtitle="Claude AI for creative and optimization" action={<span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded">Via Server Env</span>} />
                <div className="space-y-3">
                  <Input label="API Key" type="password" value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} placeholder="sk-ant-..." hint="Set ANTHROPIC_API_KEY in your .env.local file â€” never expose this client-side" />
                  <p className="text-xs text-slate-500 bg-amber-500/8 border border-amber-500/20 rounded-lg p-3">
                    AI calls are routed through the server-side <code className="text-amber-400">/api/ai</code> endpoint. Your API key is never exposed to the browser.
                  </p>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "AI Settings" && (
            <Card>
              <CardHeader title="AI Model Configuration" />
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={14} className="text-blue-400" />
                    <p className="text-sm font-medium text-slate-900">Model: claude-sonnet-4-6</p>
                  </div>
                  <p className="text-xs text-slate-400">Latest Claude model with superior reasoning for ad strategy and copywriting.</p>
                </div>
                {[
                  { label: "Max Tokens (Campaign Creation)", value: "3000" },
                  { label: "Max Tokens (Ad Copy)", value: "3000" },
                  { label: "Max Tokens (Optimization)", value: "2500" },
                  { label: "Max Tokens (Audience Builder)", value: "2500" },
                ].map((s) => (
                  <Input key={s.label} label={s.label} defaultValue={s.value} type="number" />
                ))}
                <Button variant="primary" size="sm" onClick={save}>
                  {saved ? <><CheckCircle size={13} /> Saved</> : "Save Settings"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "Notifications" && (
            <Card>
              <CardHeader title="Alert Notifications" />
              <div className="space-y-3">
                {[
                  "Critical anomaly alerts (CTR drops, budget overrun)",
                  "AI optimization actions pending approval",
                  "Campaign budget exhausted",
                  "Weekly performance digest",
                  "New AI recommendations available",
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                    <span className="text-sm text-slate-700">{item}</span>
                    <input type="checkbox" defaultChecked={i < 3} className="w-4 h-4 accent-blue-500" />
                  </label>
                ))}
                <Input label="Email for alerts" placeholder="you@company.com" type="email" />
                <Button variant="primary" size="sm" onClick={save}>
                  {saved ? <><CheckCircle size={13} /> Saved</> : "Save Preferences"}
                </Button>
              </div>
            </Card>
          )}

          {activeTab === "Scheduled Reports" && (
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">Scheduled Report Delivery</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Auto-send performance reports to stakeholders on a schedule</p>
                  </div>
                  <Button variant="outline" size="sm"><Plus size={13} /> New Schedule</Button>
                </div>
                <div className="space-y-3">
                  {schedules.map((s) => (
                    <div key={s.id} className={`p-4 rounded-lg border ${s.active ? "border-slate-200 bg-slate-50" : "border-slate-100 bg-white opacity-60"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Calendar size={14} className="text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{s.name}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                              <span>{s.frequency}{s.day !== "â€”" ? ` Â· ${s.day}` : ""} at {s.time}</span>
                              <span>â†’ {s.recipients}</span>
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">{s.format}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setSchedules((prev) => prev.map((r) => r.id === s.id ? { ...r, active: !r.active } : r))}
                            className={`w-8 h-4 rounded-full transition-colors relative ${s.active ? "bg-emerald-500" : "bg-slate-200"}`}
                          >
                            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${s.active ? "right-0.5" : "left-0.5"}`} />
                          </button>
                          <button onClick={() => setSchedules((prev) => prev.filter((r) => r.id !== s.id))} className="text-slate-500 hover:text-red-400 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card>
                <CardHeader title="New Scheduled Report" subtitle="Configure a new automated report delivery" />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Report Name" placeholder="e.g. Weekly CTR Summary" />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Frequency</label>
                    <select className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500/60">
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <Input label="Send Time" type="time" defaultValue="08:00" />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Format</label>
                    <select className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500/60">
                      <option>PDF</option>
                      <option>CSV</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Input label="Recipients (comma-separated emails)" placeholder="team@company.com, cmo@company.com" />
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="primary" size="sm" onClick={save}>{saved ? <><CheckCircle size={13} /> Saved</> : "Create Schedule"}</Button>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "Security" && (
            <Card>
              <CardHeader title="Security & Access" />
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-emerald-500/8 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-emerald-400" />
                    <p className="text-xs font-medium text-emerald-400">All API credentials stored server-side only</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">No sensitive keys are exposed to the browser. Claude API calls routed through Next.js API routes.</p>
                </div>
                {["Role-based access control", "MFA enforcement", "API key rotation", "Audit logging"].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Shield size={12} className="text-slate-400" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </div>
                    <span className="text-xs text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded">Configure</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === "Deploy Guide" && (
            <div className="space-y-4">
              <Card>
                <CardHeader title="Environment Variables" />
                <div className="bg-white rounded-lg p-4 font-mono text-xs space-y-1">
                  <p className="text-slate-500"># .env.local</p>
                  <p><span className="text-blue-400">ANTHROPIC_API_KEY</span>=<span className="text-emerald-400">sk-ant-your-key</span></p>
                  <p><span className="text-blue-400">GOOGLE_ADS_DEVELOPER_TOKEN</span>=<span className="text-emerald-400">your-dev-token</span></p>
                  <p><span className="text-blue-400">GOOGLE_ADS_CLIENT_ID</span>=<span className="text-emerald-400">your-client-id</span></p>
                  <p><span className="text-blue-400">GOOGLE_ADS_CLIENT_SECRET</span>=<span className="text-emerald-400">your-secret</span></p>
                  <p><span className="text-blue-400">LINKEDIN_CLIENT_ID</span>=<span className="text-emerald-400">your-linkedin-id</span></p>
                  <p><span className="text-blue-400">LINKEDIN_CLIENT_SECRET</span>=<span className="text-emerald-400">your-linkedin-secret</span></p>
                </div>
              </Card>
              <Card>
                <CardHeader title="Deploy to Vercel" />
                <div className="space-y-2 text-xs text-slate-700">
                  {[
                    "1. Push this repo to GitHub",
                    "2. Connect to Vercel â€” vercel.com/new",
                    "3. Add all env vars in Vercel Dashboard â†’ Settings â†’ Environment Variables",
                    "4. Deploy â€” your Next.js API routes handle all sensitive calls server-side",
                    "5. Set ANTHROPIC_API_KEY â€” AI features activate automatically",
                  ].map((step) => (
                    <p key={step} className="flex gap-2"><span className="text-blue-400 flex-shrink-0">â†’</span>{step}</p>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

