import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { lat, lng } = await req.json();
  if (!lat || !lng) return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });

  try {
    const result = await sql`
      SELECT *, (
        6371 * acos(
          cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(latitude))
        )
      ) AS distance
      FROM trade_spots
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      HAVING distance < ${10}
      ORDER BY distance ASC
      LIMIT 20
    `;

    return NextResponse.json({ tradeSpots: result.rows });
  } catch (err) {
    console.error("Error fetching Trade Spots:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}