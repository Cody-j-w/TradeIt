import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { getMe } from '@/lib/functions';

export async function GET(req: NextRequest) {
  try {
    const user = await getMe();
    const currentUserId = user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const query = `
      SELECT 
        posts.id,
        posts.text,
        posts.image,
        posts.timestamp,
        posts.type,
        posts.user_id
      FROM posts
      WHERE posts.user_id IN (
        SELECT user_id
        FROM followings
        WHERE follower_id = $1
      )
      ORDER BY posts.timestamp DESC
      LIMIT 50;
    `;

    const { rows } = await sql.query(query, [currentUserId]);

    return NextResponse.json({ posts: rows });
  } catch (err) {
    console.error('Error fetching following posts:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
