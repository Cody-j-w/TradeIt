import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET() {
  const nearbyZips = ["74101", "74103", "74104", "74105", "74106"];

  try {
    // Dynamically build parameterized placeholders like $1, $2, $3...
    const placeholders = nearbyZips.map((_, i) => `$${i + 1}`).join(", ");

    // Run the query using spread values
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
      JOIN users ON posts.user_id = users.uuid
      WHERE users.zip IN (${placeholders})
      ORDER BY posts.timestamp DESC
      LIMIT 20;
    `;

    // Use sql.query() with raw string + values
    const { rows } = await sql.query(query, nearbyZips);

    return NextResponse.json({ posts: rows });
  } catch (error) {
    console.error("❌ Error fetching near-you posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
