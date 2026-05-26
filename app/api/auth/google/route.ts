import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const clientId = (process.env.GOOGLE_OAUTH_CLIENT_ID || "").trim();
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_OAUTH_CLIENT_ID not set" }, { status: 500 });
  }

  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || "https://paid-ads-platform.vercel.app"}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/userinfo.email openid",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
