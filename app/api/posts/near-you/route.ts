import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zipParam = searchParams.get('zips');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!zipParam) {
    return NextResponse.json({ error: 'Missing zips param' }, { status: 400 });
  }

  let zips: string[];
  try {
    zips = JSON.parse(zipParam); // properly parses ["74104", "74103", ...]
  } catch (err) {
    return NextResponse.json({ error: 'Invalid zips format' }, { status: 400 });
  }

  const placeholders = zips.map((_, i) => `$${i + 1}`).join(', ');

  try {
    const query = `
      SELECT 
        posts.id,
        posts.text,
        posts.image,
        posts.timestamp,
        posts.type,
        posts.user_id,
        users.name AS user,
        goods.name AS good
      FROM posts
      JOIN users ON posts.user_id = users.id
      LEFT JOIN goods ON posts.good_id = goods.id
      WHERE users.zip IN (${placeholders})
      ORDER BY posts.timestamp DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;
    const { rows } = await sql.query(query, zips);

    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error('❌ Failed to fetch near-you posts:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
