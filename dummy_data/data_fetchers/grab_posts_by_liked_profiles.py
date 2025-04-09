#!/usr/bin/env python3
"""Retrieve the top N most recent posts liked by a specific user."""
import psycopg2
from typing import List, Optional

DB_HOST = "example_host"
DB_NAME = "example_name"
DB_USER = "example_user"
DB_PASSWORD = "example password"


def connect_to_db() -> psycopg2.extensions.connection:
    """Establises a connection to the PostgreSQL database."""
    try:
        connection = psycopg2.connect(
            host=DB_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD
        )
        return connection
    except psycopg2.Error as e:
        raise ConnectionError(
            f"Failed to connect to the PostgreSQL database: {e}"
        )


def get_recent_posts_by_liked_profiles(user_id: int, limit: int = 5) -> Optional[List[int]]:
    """Fetch the most recent post IDs and their authors from posts liked by a specific user."""

    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("limit must be a positive integer.")

    try:
        with connect_to_db() as con:
            with con.cursor() as cursor:
                cursor.execute('''
                               SELECT posts.id, posts.user_id
                               FROM posts
                               JOIN posts_likes ON posts.id = posts_likes.post_id
                               WHERE posts_likes.user_id = %s
                               ORDER BY posts.timestamp DESC
                               LIMIT %s
                               ''', (user_id, limit))
                results = cursor.fetchall()
                return results
    except psycopg2.Error as e:
        print(f"[ERROR] Failed to fetch posts for user_id '{user_id}': {e}")
        return None
