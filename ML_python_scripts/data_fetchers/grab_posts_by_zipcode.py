#!/usr/bin/env python3

import psycopg2
from datetime import datetime, timedelta
from typing import List, Optional


def get_recent_posts_by_zipcode(zip_code: int, conn: psycopg2.extensions.connection, limit: int = 5) -> Optional[List[int]]:
    if not isinstance(zip_code, int):
        raise TypeError("zip_code must be an integer.")
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("Limit must be a positive integer")

    one_week_ago = datetime.now() - timedelta(days=7)

    try:
        with conn.cursor() as con:
            with con.cursor() as cursor:
                cursor.execute('''
                               SELECT id
                               FROM posts
                               JOIN users on posts.id = users.id
                               WHERE users.zip = %s
                               ORDER BY date_posted DESC, time_posted DESC
                               LIMIT %s;
                               ''', (one_week_ago.date(), limit))
                results = cursor.fetchall()
                user_ids = [row[1] for row in results]
                return user_ids

    except psycopg2.Error as e:
        print(f"[ERROR] Failed to fetch posts for zip_code '{zip_code}': {e}")
        return None
