import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

const cache = new Map<string, { lat: number; lng: number }>();
const requestLog = new Map<string, number[]>();
const LIMIT = 25;
const WINDOW = 60 * 60 * 1000;

export async function POST(req: Request) {
  const { address } = await req.json();
  if (!address) return NextResponse.json({ error: "Missing address" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const now = Date.now();
  const history = requestLog.get(ip) || [];
  const recent = history.filter((t) => now - t < WINDOW);

  if (recent.length >= LIMIT) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  requestLog.set(ip, [...recent, now]);

  if (cache.has(address)) {
    return NextResponse.json({ location: cache.get(address) });
  }

  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );

  const data = await geoRes.json();
  if (data.status !== "OK") return NextResponse.json({ error: "Geocoding failed" }, { status: 400 });

  const location = data.results[0].geometry.location;
  cache.set(address, location);

  try {
    await sql`
      INSERT INTO geocode_logs (address, ip, latitude, longitude, timestamp)
      VALUES (${address}, ${ip}, ${location.lat}, ${location.lng}, NOW())
    `;
  } catch (err) {
    console.error("Failed to log geocode:", err);
  }

  return NextResponse.json({ location });
}
