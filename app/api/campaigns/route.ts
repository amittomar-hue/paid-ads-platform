import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const accountId = (
    req.cookies.get("google_account_id")?.value ||
    process.env.GOOGLE_ADS_CUSTOMER_ID ||
    ""
  ).replace(/-/g, "");

  const developerToken =
    process.env.GOOGLE_ADS_DEVELOPER_TOKEN || "";
  const apiKey = process.env.GOOGLE_API_KEY || "";

  if (!accountId || !developerToken) {
    return NextResponse.json({ source: "mock" });
  }

  try {
    // Google Ads Query Language (GAQL) — fetch campaigns with performance metrics
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
        metrics.all_conversions_value,
        metrics.search_impression_share
      FROM campaign
      WHERE segments.date DURING LAST_30_DAYS
      ORDER BY metrics.cost_micros DESC
      LIMIT 50
    `;

    const res = await fetch(
      `https://googleads.googleapis.com/v17/customers/${accountId}/googleAds:search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "developer-token": developerToken,
          ...(apiKey ? { "x-goog-api-key": apiKey } : {}),
        },
        body: JSON.stringify({ query: gaql }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ source: "mock", error: err?.error?.message || "Google Ads API error" });
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
