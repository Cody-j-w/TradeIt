#!/usr/bin/env python3

import sqlite3
from typing import List, Optional

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"


def connect_to_db(db_path: str) -> sqlite3.Connection:
    """Establishes a connection to SQLite database."""
    try:
        return sqlite3.connect(db_path)
    except sqlite3.Error as e:
        raise ConnectionError(
            f"Failed to connect to the database at {db_path}: {e}"
        )


def get_recent_posts_by_liked_profiles(user_id: int, limit: int = 5, db_path: str = DB_PATH) -> Optional[List[int]]:

    if not isinstance(user_id, int):
        raise TypeError("user_id must be an integer.")
    if not isinstance(limit, int) or limit <= 0:
        raise ValueError("limit must be a positive integer.")

    try:
        with connect_to_db(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                           SELECT posts.id, posts.user_id, posts.text, posts.tags
                           FROM posts
                           JOIN likes ON posts.id = likes.post_id
                           WHERE likes.user_id = ?
                           ORDER BY posts.date_posted DESC, posts.time_posted DESC
                           LIMIT ?;
                           ''', (user_id, limit))
            results = cursor.fetchall()
            conn.close()
            return results

    except sqlite3.Error as e:
        print(f"[ERROR] Failed")
        return None
