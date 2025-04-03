import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, address } = await req.json();

  if (!name || !address) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    // Geocode the address
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    const geoData = await geoRes.json();
    if (geoData.status !== "OK") {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    const location = geoData.results[0].geometry.location;

    // Use `sql` from @vercel/postgres
    await sql`
      INSERT INTO trade_spots (name, address, latitude, longitude, verified)
      VALUES (${name}, ${address}, ${location.lat}, ${location.lng}, ${true})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error adding Trade Spot:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}