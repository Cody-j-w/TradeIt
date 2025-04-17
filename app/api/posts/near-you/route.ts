import { sql } from '@vercel/postgres';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const zipParams = searchParams.getAll('zips');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = 15;
  const offset = (page - 1) * limit;

  if (!zipParams || zipParams.length === 0) {
    return NextResponse.json({ error: 'Missing ZIP code(s)' }, { status: 400 });
  }

  try {
    const placeholders = zipParams.map((_, i) => `$${i + 1}`).join(', ');
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
      OFFSET ${offset};
    `;

    const { rows } = await sql.query(query, zipParams);
    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error('❌ Error fetching near-you posts:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
