import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// Use API key SID as username, secret as password
const client = twilio(
  process.env.TWILIO_API_KEY_SID!,
  process.env.TWILIO_API_KEY_SECRET!
);

export async function POST(req: NextRequest) {
  const { phone, lat, lng } = await req.json();

  if (!phone || !lat || !lng) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    await client.messages.create({
      to: phone,
      from: process.env.TWILIO_PHONE!,
      body: `🚨 Your contact missed a safety check-in! Last location: https://maps.google.com/?q=${lat},${lng}`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Twilio error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
