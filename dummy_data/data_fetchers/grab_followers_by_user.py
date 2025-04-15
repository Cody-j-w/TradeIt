#!/usr/bin/env python3
"""Retrieve the top N recent posts from users followed by a spefific user."""

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


def get_recent_followers_posts(user_id: int, limit: int = 5) -> Optional[List[int]]:
    """Fetch the most recent post IDs from the user that the given user is following"""

    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("limit must be a positive integer.")

    try:
        with connect_to_db() as con:
            with con.cursor() as cursor:
                cursor.execute('''
                               SELECT posts.id
                               FROM posts
                               JOIN followings ON posts.user_id = followings.user_id
                               WHERE followings.user_id = %s
                               ORDER BY posts.timestamp DESC
                               LIMIT %s;
                               ''', (user_id, limit))
                results = cursor.fetchall()
                user_ids = [row[0] for row in results]
                return user_ids

    except psycopg2.Error as e:
        print(f"[ERROR] Failed to fetch posts for user_id '{user_id}': {e}")
        return None
