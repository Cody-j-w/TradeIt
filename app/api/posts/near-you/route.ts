import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

type RequestBody = {
  zip: string;
};

function getNearbyZips(zip: string): string[] {
  const base = parseInt(zip);
  if (isNaN(base)) return [zip];
  return Array.from({ length: 9 }, (_, i) => (base - 4 + i).toString());
}

export async function POST(req: Request) {
  const body: RequestBody = await req.json();

  if (!body.zip) {
    return NextResponse.json({ error: "Missing ZIP code" }, { status: 400 });
  }

  const nearbyZips = getNearbyZips(body.zip);
  const zipArrayLiteral = `{${nearbyZips.join(",")}}`;

  try {
    const { rows } = await sql`
      SELECT
        posts.id,
        posts.content,
        posts.timestamp,
        posts.user_id,
        users.name AS author_name,
        users.zip AS author_zip,
        users.image AS author_image,
        users.slug AS author_slug
      FROM posts
      JOIN users ON posts.user_id = users.uuid
      WHERE users.zip = ANY(${zipArrayLiteral}::text[])
      ORDER BY posts.timestamp DESC
      LIMIT 50;
    `;

    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error("Error fetching posts near ZIP:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
