import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, address } = req.body;
  if (!name || !address) return res.status(400).json({ error: "Missing fields" });

  try {
    const geoRes = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`); // BACKEND GOOGLE GEOCODING API KEY
    const geoData = await geoRes.json();
    if (geoData.status !== "OK") return res.status(400).json({ error: "Invalid address" });

    const location = geoData.results[0].geometry.location;
    await pool.query(`INSERT INTO trade_spots (name, address, latitude, longitude, verified) VALUES ($1, $2, $3, $4, $5)`, [name, address, location.lat, location.lng, true]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error adding Trade Spot:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}