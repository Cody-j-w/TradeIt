#!/usr/bin/env python3

import sqlite3
from datetime import datetime, timedelta

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"


def get_recent_posts_by_week(limit=10):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    one_week_ago = (datetime.now() - timedelta(days=7)).strftime('%Y-%m-&d')

    cursor.execute('''
                   SELECT posts.id, posts.user_id, posts.date_posted, posts.time_posted
                   FROM posts
                   WHERE date_posted >= ?
                   ORDER BY date_posted DESC, time_posted DESC
                   LIMIT ?;
                   ''', (one_week_ago, limit))
    results = cursor.fetchall()
    conn.close()

    return results
