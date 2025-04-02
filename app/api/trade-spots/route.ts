import type { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ error: "Missing coordinates" });

  try {
    const result = await pool.query(
      `SELECT *, (
        6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) * cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )
      ) AS distance
      FROM trade_spots
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < $3
      ORDER BY distance ASC
      LIMIT 20;`,
      [lat, lng, 10]
    );
    res.status(200).json({ tradeSpots: result.rows });
  } catch (err) {
    console.error("Error fetching Trade Spots:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}