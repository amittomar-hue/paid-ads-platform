import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { platform, key } = await req.json();

  if (!platform || !key?.trim()) {
    return NextResponse.json({ error: "platform and key are required" }, { status: 400 });
  }

  const cookieName = platform === "google" ? "google_account_id" : "linkedin_account_id";
  const res = NextResponse.json({ ok: true });

  res.cookies.set(cookieName, key.trim(), {
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
  const cookieName = platform === "google" ? "google_account_id" : "linkedin_account_id";
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(cookieName);
  return res;
}
