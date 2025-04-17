#!/usr/bin/env python3

import psycopg2
from datetime import datetime, timedelta
from typing import List, Optional


def get_recent_posts_by_week(user_id, conn, limit: int = 2) -> Optional[List[int]]:

    one_week_ago = datetime.now() - timedelta(days=7)

    cursor = conn.cursor()
    cursor.execute('''
                    SELECT id, user_id, timestamp
                    FROM posts
                    WHERE timestamp >= %s
                    ORDER BY timestamp DESC
                    LIMIT %s;
                    ''', (one_week_ago.date(), limit))
    results = cursor.fetchall()
    user_ids = [row[0] for row in results]
    return user_ids
