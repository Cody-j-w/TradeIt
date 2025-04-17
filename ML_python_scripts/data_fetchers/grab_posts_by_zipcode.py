#!/usr/bin/env python3

import psycopg2
from datetime import datetime, timedelta
from typing import List, Optional

DB_HOST = "example_host"
DB_NAME = "example_name"
DB_USER = "example_user"
DB_PASSWORD = "example password"


def get_user_zip(user_id, conn):
    cursor = conn.cursor()

    cursor.execute("""
        SELECT zip FROM users
        WHERE users.id = %s::uuid
    """, (user_id,))

    user_zip_code = cursor.fetchone()

    return user_zip_code[0] if user_zip_code else None


def get_recent_posts_by_zipcode(user_id, conn, limit: int = 5) -> Optional[list[int]]:
    # if not isinstance(zip_code, int):
    #     raise TypeError("zip_code must be an integer.")
    # if not isinstance(limit, int) or limit <= 0:
    #     raise ValueError("Limit must be a positive integer")

    user_zip_code = get_user_zip(user_id, conn)
    if not user_zip_code:
        return None

    one_week_ago = datetime.now() - timedelta(days=7)

    # try:
    cursor = conn.cursor()
    cursor.execute('''
                    SELECT posts.id
                    FROM posts
                    JOIN users on posts.user_id = users.id
                    WHERE users.zip = %s
                    AND posts.timestamp >= %s::date
                    ORDER BY posts.timestamp DESC
                    LIMIT %s;
                    ''', (user_zip_code, one_week_ago, limit))
    results = cursor.fetchall()
    post_ids = [row[0] for row in results]
    return post_ids

    # except psycopg2.Error as e:
    #     print(f"[ERROR] Failed to fetch posts for zip_code '{zip_code}': {e}")
    #     return None
