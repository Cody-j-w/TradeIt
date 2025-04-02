import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// In-memory cache for geocoded addresses
const cache = new Map<string, { lat: number; lng: number }>();

// In-memory rate limit tracker (per IP)
const requestLog = new Map<string, number[]>(); // IP -> array of timestamps
const LIMIT = 25; // max requests per window
const WINDOW = 60 * 60 * 1000; // 1 hour

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { address } = req.body;
  if (!address) return res.status(400).json({ error: "Missing address" });

  // Get client IP
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;

  // Rate limiting
  const now = Date.now();
  const history = requestLog.get(ip) || [];
  const recent = history.filter((t) => now - t < WINDOW);

  if (recent.length >= LIMIT) {
    return res.status(429).json({ error: "Rate limit exceeded. Try again later." });
  }

  requestLog.set(ip, [...recent, now]);

  // Check cache
  if (cache.has(address)) {
    return res.status(200).json({ location: cache.get(address) });
  }

  // Call Google Geocoding API
  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    // BACKEND GOOGLE GEOCODING API KEY
  );

  const data = await geoRes.json();
  if (data.status !== "OK") return res.status(400).json({ error: "Geocoding failed" });

  const location = data.results[0].geometry.location;
  cache.set(address, location);

  // Log to DB
  await pool.query(
    "INSERT INTO geocode_logs (address, ip, latitude, longitude, timestamp) VALUES ($1, $2, $3, $4, now())",
    [address, ip, location.lat, location.lng]
  );

  res.status(200).json({ location });
}