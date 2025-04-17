#!/usr/bin/env python3
"""Retrieve the top N most recent posts liked by a specific user."""

import psycopg2
from typing import List, Optional


def get_recent_posts_by_liked_profiles(user_id, conn, limit: int = 5) -> Optional[List[int]]:
    """Fetch the most recent post IDs and their authors from posts liked by a specific user."""

    cursor = conn.cursor()

    cursor.execute('''
                    SELECT posts.id, posts.user_id
                    FROM posts
                    JOIN posts_likes ON posts.id = posts_likes.post_id
                    WHERE posts_likes.user_id = %s
                    ORDER BY posts.timestamp DESC
                    LIMIT %s
                    ''', (user_id, limit))
    results = cursor.fetchall()
    user_ids = [row[0] for row in results]
    return user_ids
