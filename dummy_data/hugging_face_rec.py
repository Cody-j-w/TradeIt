#!/usr/bin/env
import pandas as pd
import sqlite3
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

conn = sqlite3.connect(DB_PATH)
df = pd.read_sql_query(
    "SELECT id, user_id, tags, text, goods FROM posts", conn)
df = df.dropna()
df['description'] = df['tags'] + ' ' + df['goods'] + ' ' + df['text']
conn.close()

model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
post_embeddings = model.encode(df['description'].tolist())


def get_recommendations(query, embeddings, df, top_n=20):
    query_embedding = model.encode([query])
    similarities = cosine_similarity(query_embedding, embeddings)
    top_indices = similarities[0].argsort()[-top_n:][::-1]
    return df.iloc[top_indices]


# how to make the query more dynamic ex how would i make a "query" when someone logs in to the page.
query = "posts with bread i can trade with"

recommendations = get_recommendations(query, post_embeddings, df)
recommendations = recommendations.drop_duplicates()
print(recommendations[['id', 'text', 'tags', 'goods']])
