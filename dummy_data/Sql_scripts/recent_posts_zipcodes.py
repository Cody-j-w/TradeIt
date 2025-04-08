#!/usr/bin/env python3
"""Fetch recent posts by user in a specific zip code"""
import sqlite3

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

zip_code = 90053


def most_recent_post_ids_by_zip(zip_code, limit=5):
    cursor.execute('''
        SELECT posts.id
        FROM posts
        JOIN users ON posts.user_id = users.id
        WHERE users.zip_code = ?
        ORDER BY posts.date_posted DESC, posts.time_posted DESC
        LIMIT ?;
    ''', (zip_code, limit))

    results = cursor.fetchall()
    return [row[0] for row in results]


print(most_recent_post_ids_by_zip(zip_code))

conn.close()
