import { NextRequest, NextResponse } from "next/server";

const clean = (v = "") => v.replace(/﻿/g, "").trim();

async function getAccessToken(req: NextRequest): Promise<string> {
  const fromCookie = clean(req.cookies.get("google_ads_access_token")?.value || "");
  if (fromCookie) return fromCookie;

  const clientId = clean(process.env.GOOGLE_OAUTH_CLIENT_ID || process.env.GOOGLE_ADS_CLIENT_ID);
  const clientSecret = clean(process.env.GOOGLE_OAUTH_CLIENT_SECRET || process.env.GOOGLE_ADS_CLIENT_SECRET);
  const refreshToken = clean(req.cookies.get("google_ads_refresh_token")?.value || process.env.GOOGLE_ADS_REFRESH_TOKEN || "");

  if (!clientId || !clientSecret || !refreshToken) return "";

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  if (!res.ok) return "";
  const data = await res.json();
  return data.access_token || "";
}

export async function GET(req: NextRequest) {
  const developerToken = clean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN);
  const accessToken = await getAccessToken(req);

  if (!accessToken || !developerToken) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch("https://googleads.googleapis.com/v17/customers:listAccessibleCustomers", {
    headers: { "Authorization": `Bearer ${accessToken}`, "developer-token": developerToken },
  });

  const text = await res.text();
  if (!res.ok) return NextResponse.json({ error: text.slice(0, 500) }, { status: res.status });

  return NextResponse.json(JSON.parse(text));
}
