// app/api/trade-spots/route.ts
import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { lat, lng } = await request.json();

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 });
    }

    const { rows } = await sql`
      SELECT id, name, address, latitude, longitude
      FROM locations
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      AND verified = true
      LIMIT 50;
    `;

    return NextResponse.json({ tradeSpots: rows });
  } catch (err) {
    console.error("Error fetching trade spots:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
