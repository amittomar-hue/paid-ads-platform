import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accountId = (
    req.cookies.get("google_account_id")?.value ||
    process.env.GOOGLE_ADS_CUSTOMER_ID ||
    ""
  ).replace(/-/g, "");

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "";
  const accessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN || "";
  const loginCustomerId = process.env.GOOGLE_ADS_MANAGER_ID || "";

  if (!accountId) {
    return NextResponse.json({
      source: "mock",
      error: "No Ad Account ID set. Enter it in the sidebar to connect.",
    });
  }

  if (!developerToken) {
    return NextResponse.json({
      source: "mock",
      error: "GOOGLE_ADS_DEVELOPER_TOKEN is missing.",
    });
  }

  if (!accessToken) {
    return NextResponse.json({
      source: "mock",
      error: "GOOGLE_ADS_ACCESS_TOKEN is missing.",
    });
  }

  const gaql = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      metrics.cost_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.ctr,
      metrics.average_cpc,
      metrics.conversions,
      metrics.cost_per_conversion,
      metrics.all_conversions_value
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
    ORDER BY metrics.cost_micros DESC
    LIMIT 50
  `;

  try {
    const res = await fetch(
      `https://googleads.googleapis.com/v17/customers/${accountId}/googleAds:search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "developer-token": developerToken,
          "Authorization": `Bearer ${accessToken}`,
          ...(loginCustomerId ? { "login-customer-id": loginCustomerId } : {}),
        },
        body: JSON.stringify({ query: gaql }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      const message =
        err?.error?.details?.[0]?.errors?.[0]?.message ||
        err?.error?.message ||
        `Google Ads API error (${res.status})`;
      return NextResponse.json({ source: "mock", error: message });
    }

    const data = await res.json();
    const rows = data.results || [];

    const campaigns = rows.map((row: any, i: number) => {
      const c = row.campaign;
      const b = row.campaignBudget;
      const m = row.metrics;
      const spend = (m?.costMicros || 0) / 1_000_000;
      const budgetDaily = (b?.amountMicros || 0) / 1_000_000;
      const conversions = m?.conversions || 0;
      const convValue = m?.allConversionsValue || 0;
      return {
        id: c?.id || `r${i}`,
        platform: "google",
        name: c?.name || "Unknown",
        status: c?.status === "ENABLED" ? "Active" : c?.status === "PAUSED" ? "Paused" : "Draft",
        type: c?.advertisingChannelType || "Search",
        objective: "Conversions",
        budget_daily: budgetDaily,
        budget_total: budgetDaily * 30,
        spend,
        impressions: m?.impressions || 0,
        clicks: m?.clicks || 0,
        ctr: (m?.ctr || 0) * 100,
        cpc: (m?.averageCpc || 0) / 1_000_000,
        conversions,
        cpa: conversions > 0 ? spend / conversions : 0,
        roas: spend > 0 ? convValue / spend : 0,
        quality_score: 70,
        start_date: new Date().toISOString().split("T")[0],
      };
    });

    return NextResponse.json({ source: "live", campaigns });
  } catch (e: any) {
    return NextResponse.json({ source: "mock", error: e?.message });
  }
}
