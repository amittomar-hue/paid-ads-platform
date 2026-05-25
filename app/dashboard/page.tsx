"use client";

import { TopBar } from "@/components/layout/TopBar";
import { KpiCard } from "@/components/ui/KpiCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge, PlatformBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  MOCK_CAMPAIGNS,
  MOCK_ALERTS,
  MOCK_OPTIMIZATIONS,
  WEEKLY_SPEND,
} from "@/lib/mock-data";
import {
  formatCurrency,
  formatNumber,
  formatPct,
  statusColor,
  severityColor,
} from "@/lib/utils";
import {
  Megaphone,
  DollarSign,
  TrendingUp,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Target,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const activeCampaigns = MOCK_CAMPAIGNS.filter((c) => c.status === "Active");
const totalSpend = MOCK_CAMPAIGNS.reduce((s, c) => s + c.spend, 0);
const totalConversions = MOCK_CAMPAIGNS.reduce((s, c) => s + c.conversions, 0);
const avgRoas =
  MOCK_CAMPAIGNS.reduce((s, c) => s + c.roas, 0) / MOCK_CAMPAIGNS.length;
const avgQS =
  MOCK_CAMPAIGNS.reduce((s, c) => s + c.quality_score, 0) /
  MOCK_CAMPAIGNS.length;

export default function DashboardPage() {
  const pendingActions = MOCK_OPTIMIZATIONS.filter(
    (o) => o.approval_status === "pending"
  );
  const unresolvedAlerts = MOCK_ALERTS.filter((a) => !a.resolved);

  return (
    <div className="flex flex-col flex-1">
      <TopBar
        title="Executive Dashboard"
        subtitle="Last updated: just now · Auto-refresh every 15 min"
        action={
          <Link href="/campaigns/create">
            <Button variant="primary" size="sm">
              <Megaphone size={13} /> New Campaign
            </Button>
          </Link>
        }
      />

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Anomaly Alerts Banner */}
        {unresolvedAlerts.length > 0 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-red-300">
                {unresolvedAlerts.length} anomaly alert
                {unresolvedAlerts.length > 1 ? "s" : ""} detected
              </p>
              <p className="text-xs text-red-400/70 mt-0.5">
                {unresolvedAlerts[0].description}
              </p>
            </div>
            <Link href="/alerts">
              <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                View All <ArrowRight size={12} />
              </Button>
            </Link>
          </div>
        )}

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="Active Campaigns"
            value={String(activeCampaigns.length)}
            sub={`${MOCK_CAMPAIGNS.length} total`}
            change="2 campaigns"
            changePositive
            icon={Megaphone}
            iconColor="#4285f4"
          />
          <KpiCard
            label="Total Spend (MTD)"
            value={formatCurrency(totalSpend, true)}
            change="12.4%"
            changePositive
            icon={DollarSign}
            iconColor="#10b981"
          />
          <KpiCard
            label="Total Conversions"
            value={formatNumber(totalConversions)}
            change="8.7%"
            changePositive
            icon={Target}
            iconColor="#8b5cf6"
          />
          <KpiCard
            label="Avg ROAS"
            value={`${avgRoas.toFixed(1)}x`}
            change="0.3x"
            changePositive
            icon={TrendingUp}
            iconColor="#f59e0b"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Spend Chart */}
          <Card className="lg:col-span-2">
            <CardHeader
              title="Weekly Spend by Platform"
              subtitle="Last 6 weeks"
              action={
                <Link href="/analytics">
                  <Button variant="ghost" size="sm">
                    Full Report <ArrowRight size={12} />
                  </Button>
                </Link>
              }
            />
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={WEEKLY_SPEND} barSize={10} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="week"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}K`}
                />
                <Tooltip
                  contentStyle={{
                    background: "#1c1c24",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#f1f5f9",
                    fontSize: 12,
                  }}
                  formatter={(v) => formatCurrency(Number(v))}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#94a3b8" }}
                />
                <Bar dataKey="google" name="Google Ads" fill="#4285f4" radius={[3, 3, 0, 0]} />
                <Bar dataKey="linkedin" name="LinkedIn Ads" fill="#0077b5" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Platform Performance */}
          <Card>
            <CardHeader title="Platform Summary" />
            {(["google", "linkedin"] as const).map((p) => {
              const campaigns = MOCK_CAMPAIGNS.filter((c) => c.platform === p);
              const spend = campaigns.reduce((s, c) => s + c.spend, 0);
              const convs = campaigns.reduce((s, c) => s + c.conversions, 0);
              const roas = campaigns.reduce((s, c) => s + c.roas, 0) / campaigns.length;
              return (
                <div key={p} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <PlatformBadge platform={p} />
                    <span className="text-xs text-slate-400">{campaigns.length} campaigns</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Spend", value: formatCurrency(spend, true) },
                      { label: "Convs", value: formatNumber(convs) },
                      { label: "ROAS", value: `${roas.toFixed(1)}x` },
                    ].map((m) => (
                      <div key={m.label} className="bg-white/4 rounded-lg p-2 text-center">
                        <p className="text-xs text-slate-500">{m.label}</p>
                        <p className="text-sm font-semibold text-white mt-0.5">{m.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Optimizations */}
          <Card>
            <CardHeader
              title="Pending AI Actions"
              subtitle={`${pendingActions.length} awaiting approval`}
              action={
                <Link href="/optimize">
                  <Button variant="ghost" size="sm">
                    Review <ArrowRight size={12} />
                  </Button>
                </Link>
              }
            />
            <div className="space-y-2">
              {pendingActions.slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/3 border border-white/6">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    action.impact === "High" ? "bg-blue-400" : action.impact === "Medium" ? "bg-amber-400" : "bg-slate-400"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{action.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <PlatformBadge platform={action.platform} />
                      <span className="text-[10px] text-emerald-400">{action.estimated_improvement}</span>
                    </div>
                  </div>
                  <Badge variant={action.impact === "High" ? "info" : "warning"}>
                    {action.impact}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Campaign Table */}
          <Card>
            <CardHeader
              title="All Campaigns"
              action={
                <Link href="/campaigns">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight size={12} />
                  </Button>
                </Link>
              }
            />
            <div className="space-y-2">
              {MOCK_CAMPAIGNS.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{c.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PlatformBadge platform={c.platform} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-white">{c.roas.toFixed(1)}x</p>
                    <p className="text-[10px] text-slate-500">ROAS</p>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Create Campaign", icon: Megaphone, href: "/campaigns/create", color: "#4285f4" },
            { label: "Run Optimization", icon: Zap, href: "/optimize", color: "#10b981" },
            { label: "Generate Ad Copy", icon: TrendingUp, href: "/creative", color: "#8b5cf6" },
            { label: "Budget Planner", icon: DollarSign, href: "/budget", color: "#f59e0b" },
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/4 border border-white/8 hover:bg-white/6 hover:border-white/15 transition-colors cursor-pointer">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${action.color}20` }}
                >
                  <action.icon size={15} style={{ color: action.color }} />
                </div>
                <p className="text-xs font-medium text-slate-300">{action.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
