import { NextRequest, NextResponse } from "next/server";

const clean = (v = "") => v.replace(/﻿/g, "").trim();

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = clean(process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID);
  const clientSecret = clean(process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET);
  if (!clientId || !clientSecret || !refreshToken) return "";

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return "";
  const data = await res.json();
  return data.access_token || "";
}

export async function GET(req: NextRequest) {
  const accountId = clean(
    req.cookies.get("google_account_id")?.value ||
    process.env.GOOGLE_ADS_CUSTOMER_ID || ""
  ).replace(/-/g, "");

  const developerToken = clean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN);

  if (!accountId) {
    return NextResponse.json({ source: "mock", error: "No Ad Account ID — enter it via the sidebar Connect button." });
  }
  if (!developerToken) {
    return NextResponse.json({ source: "mock", error: "GOOGLE_ADS_DEVELOPER_TOKEN is missing." });
  }

  // Get access token: prefer cookie (from OAuth flow), else refresh via env refresh token
  let accessToken = clean(req.cookies.get("google_ads_access_token")?.value || "");
  const refreshToken = clean(
    req.cookies.get("google_ads_refresh_token")?.value ||
    process.env.GOOGLE_ADS_REFRESH_TOKEN || ""
  );

  if (!accessToken && refreshToken) {
    accessToken = await refreshAccessToken(refreshToken);
  }

  if (!accessToken) {
    return NextResponse.json({
      source: "mock",
      error: "Not authenticated. Go to Settings → API Connections → click 'Connect Google Ads' to authorise.",
    });
  }

  const gaql = `
    SELECT
      campaign.id, campaign.name, campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.amount_micros,
      metrics.cost_micros, metrics.impressions, metrics.clicks,
      metrics.ctr, metrics.average_cpc, metrics.conversions,
      metrics.cost_per_conversion, metrics.all_conversions_value
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
        },
        body: JSON.stringify({ query: gaql }),
      }
    );

    const text = await res.text();
    if (!res.ok) {
      let message = `Google Ads API error (${res.status})`;
      try {
        const err = JSON.parse(text);
        message = err?.error?.details?.[0]?.errors?.[0]?.message ||
                  err?.error?.details?.[0]?.message ||
                  err?.error?.message || text.slice(0, 300);
      } catch { message = text.slice(0, 300); }
      return NextResponse.json({ source: "mock", error: message });
    }

    const data = JSON.parse(text);
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
