import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "https://paid-ads-platform.vercel.app"}/settings?google_auth=error`);
  }

  const clientId = (process.env.GOOGLE_OAUTH_CLIENT_ID || "").trim();
  const clientSecret = (process.env.GOOGLE_OAUTH_CLIENT_SECRET || "").trim();
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "https://paid-ads-platform.vercel.app"}/api/auth/google/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "https://paid-ads-platform.vercel.app"}/settings?google_auth=error`);
  }

  const tokens = await tokenRes.json();
  const refreshToken = tokens.refresh_token || "";
  const accessToken = tokens.access_token || "";

  const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL || "https://paid-ads-platform.vercel.app"}/campaigns?google_auth=success`);

  // Store tokens in secure cookies (valid 90 days)
  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 90, path: "/" };
  if (refreshToken) res.cookies.set("google_ads_refresh_token", refreshToken, cookieOpts);
  if (accessToken) res.cookies.set("google_ads_access_token", accessToken, cookieOpts);

  return res;
}
