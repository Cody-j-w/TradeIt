#!/usr/bin/env python3

import psycopg2
from typing import List, Optional
from collections import Counter


def get_weighted_tags_from_liked_posts(user_id: int, conn: psycopg2.extensions.connection, limit: int = 5) -> Optional[List[int]]:
    """
    Recommend posts based on tags from the user's liked posts.
    Returns a list of recommended post_ids.
    """
    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("limit must be a positive integer.")

    try:
        with conn.cursor() as cursor:
            # Get tags from liked posts
            cursor.execute('''
                SELECT pt.tag_id
                FROM post_likes pl
                JOIN post_tags pt ON pl.post_id = pt.post_id
                WHERE pl.user_id = %s;
            ''', (user_id,))
            liked_tags = [row[0] for row in cursor.fetchall()]

            if not liked_tags:
                return []

            # Weight tags by frequency
            tag_weights = Counter(liked_tags)

            # Create a string of tag_ids for SQL IN clause
            tag_id_tuple = tuple(tag_weights.keys())

            # Get posts with those tags, weighted by tag frequency
            cursor.execute(f'''
                SELECT pt.post_id, pt.tag_id
                FROM post_tags pt
                WHERE pt.tag_id IN %s;
            ''', (tag_id_tuple,))

            post_scores = {}
            for post_id, tag_id in cursor.fetchall():
                post_scores[post_id] = post_scores.get(
                    post_id, 0) + tag_weights[tag_id]

            # Sort posts by score
            recommended_posts = sorted(
                post_scores.items(), key=lambda x: x[1], reverse=True)
            return [post_id for post_id, _ in recommended_posts[:limit]]

    except psycopg2.Error as e:
        print(
            f"[ERROR] Failed to fetch weighted tag posts for user_id '{user_id}': {e}")
        return None
