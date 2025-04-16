// app/api/posts/near-you/route.ts
import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";
import { getMe } from "@/lib/functions"; // Get the logged-in user with zip

export async function GET(req: NextRequest) {
  try {
    const me = await getMe();

    if (!me || !me.zip) {
      return NextResponse.json({ error: "User ZIP not found" }, { status: 400 });
    }

    const userZip = me.zip;

    // Define nearby zips here or dynamically based on a ZIP mapping
    const nearbyZips = [userZip, "74103", "74104", "74105", "74106"]; // expand later

    const placeholders = nearbyZips.map((_, i) => `$${i + 1}`).join(", ");
    const values = [...nearbyZips];

    const query = `
      SELECT 
        posts.id,
        posts.text,
        posts.image,
        posts.timestamp,
        posts.user,
        posts.good,
        users.zip
      FROM posts
      JOIN users ON posts.user_id = users.id
      WHERE users.zip IN (${placeholders})
      ORDER BY posts.timestamp DESC
      LIMIT 20;
    `;

    const { rows } = await sql.query(query, values);
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error("❌ Error fetching near-you posts:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}