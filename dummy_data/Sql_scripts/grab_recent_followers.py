#!/usr/bin/env python3
"""This script will hopefully grab the users followers top 3 most recent posts"""
import sqlite3


DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

test_user_id = 1


def recent_post_id(test_user_id, limit=5):
    cursor.execute('''
                   SELECT posts.id
                   FROM posts
                   JOIN follows ON posts.user_id = follows.following_id
                   WHERE follows.follower_id = ?
                   ORDER BY posts.date_posted DESC, posts.time_posted DESC
                   LIMIT ?;
                   ''', (test_user_id, limit))

    results = cursor.fetchall()
    return [row[0] for row in results]


print(recent_post_id(test_user_id))


conn.close()
