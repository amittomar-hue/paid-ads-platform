import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { platform, key } = await req.json();

  if (!platform || !key) {
    return NextResponse.json({ error: "platform and key are required" }, { status: 400 });
  }

  // Validate the key format minimally
  if (platform === "google" && !key.startsWith("AIza") && key.length < 20) {
    return NextResponse.json({ error: "Invalid Google API key format" }, { status: 400 });
  }
  if (platform === "linkedin" && key.length < 10) {
    return NextResponse.json({ error: "Invalid LinkedIn key" }, { status: 400 });
  }

  const cookieName = platform === "google" ? "google_api_key" : "linkedin_api_key";
  const res = NextResponse.json({ ok: true });

  res.cookies.set(cookieName, key, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  return res;
}

export async function DELETE(req: NextRequest) {
  const { platform } = await req.json();
  const cookieName = platform === "google" ? "google_api_key" : "linkedin_api_key";
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(cookieName);
  return res;
}
