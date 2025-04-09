# data_fetchers/grab_posts_by_liked_profiles.py

import sqlite3

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"


def get_recent_posts_by_liked_profiles(user_id, limit=10):
    conn = sqlite3.connect(DB_PATH)
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
