#!/usr/bin/env python3
import sqlite3
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import OneHotEncoder

# Database path
DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

# Connect to the database and fetch data
conn = sqlite3.connect(DB_PATH)
df = pd.read_sql_query("SELECT id, user_id, tags, goods FROM posts", conn)
conn.close()

# One-hot encode the 'tags' and 'goods' columns
encoder = OneHotEncoder(handle_unknown='ignore')
encoded_features = encoder.fit_transform(df[['tags', 'goods']])

# Compute cosine similarity
similarity_matrix = cosine_similarity(encoded_features)

# Convert to DataFrame for easy lookup
similarity_df = pd.DataFrame(
    similarity_matrix, index=df['id'], columns=df['id'])

# Function to get top N similar posts for a given post_id


def get_similar_posts(post_id, top_n=5):
    similar_posts = similarity_df[post_id].sort_values(
        ascending=False).iloc[1:top_n+1]
    return similar_posts


# Example: Get similar posts for a given post_id
post_id_example = df['id'].iloc[0]  # Example post_id
print(get_similar_posts(post_id_example))

# print(df['tags'].nunique(), df['goods'].nunique())
# print(df.groupby(['tags', 'goods']).size().sort_values(ascending=False))
