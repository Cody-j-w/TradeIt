import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 15;
  const offset = (page - 1) * limit;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // Get the zip of the user making the request
    const zipResult = await sql`
      SELECT zip FROM users WHERE id = ${userId}
    `;

    const userZip = zipResult.rows[0]?.zip;

    if (!userZip) {
      return NextResponse.json({ error: "User ZIP not found" }, { status: 404 });
    }

    // For now, mock nearby ZIPs
    const nearbyZips = [userZip, "74101", "74103", "74104", "74105", "74106"];

    const placeholders = nearbyZips.map((_, i) => `$${i + 1}`).join(", ");

    // Build the SQL query
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
      LIMIT ${limit} OFFSET ${offset};
    `;

    const { rows } = await sql.query(query, nearbyZips);

    return NextResponse.json({ posts: rows });
  } catch (error) {
    console.error("❌ Error fetching near-you posts:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
