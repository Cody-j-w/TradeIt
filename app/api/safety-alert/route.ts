import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!); // BACKEND TWILIO API KEYS

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { phone, lat, lng } = req.body;
  await client.messages.create({
    to: phone,
    from: process.env.TWILIO_PHONE!,
    body: `🚨 Your contact missed a safety check-in! Last location: https://maps.google.com/?q=${lat},${lng}`,
  });
  res.status(200).json({ success: true });
}
