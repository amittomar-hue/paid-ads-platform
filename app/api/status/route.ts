import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const googleEnv = !!(process.env.GOOGLE_API_KEY || process.env.GOOGLE_ADS_DEVELOPER_TOKEN);
  const linkedinEnv = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_ACCESS_TOKEN);

  const googleCookie = req.cookies.get("google_account_id")?.value;
  const linkedinCookie = req.cookies.get("linkedin_account_id")?.value;

  return NextResponse.json({
    google: googleEnv || !!googleCookie,
    linkedin: linkedinEnv || !!linkedinCookie,
  });
}
