import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    google: !!(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID),
    linkedin: !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_ACCESS_TOKEN),
  });
}
