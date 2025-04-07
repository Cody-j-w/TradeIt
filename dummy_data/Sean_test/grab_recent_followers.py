#!/usr/bin/env python3
"""This script will hopefully grab the users followers top 3 most recent posts"""
import sqlite3


DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

test_user_id = 1

cursor.execute('''
    SELECT posts.id, posts.user_id, users.name, posts.trade_status, posts.tags, 
           posts.text, posts.goods, posts.date_posted, posts.time_posted
    FROM posts
    JOIN follows ON posts.user_id = follows.following_id
    JOIN users ON posts.user_id = users.id
    WHERE follows.follower_id = ?
    ORDER BY posts.date_posted DESC, posts.time_posted DESC;
''', (test_user_id,))

posts = cursor.fetchall()
print(posts)
