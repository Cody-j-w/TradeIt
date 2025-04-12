#!/usr/bin/env python3

# I have no idea what a postgres implimentation looks like
# So I don't know if we need a shebang
# Anyway here's some imports

from sentence_transformers import SentenceTransformer
# import json

# I imagine that since this'll be running on cody's machine
# I won't need to have this downloaded.
# Jury's out though
import psycopg2
import re
import numpy as np
# We'll also need to pull the env variable
# So I'm importing OS for now
import os
from fastapi import FastAPI

app = FastAPI()

model = SentenceTransformer('all-MiniLM-L6-v2')


def pull_tags(text):
    return re.findall(r'#\w+', text)


def clean_text(text):
    return re.sub(r'#\w+', '', text)


def camel_case_split(str):
    return re.sub(r'([a-z])([A-Z])',
                  r'\1 \2', str)


def preprocess_tags(tags):
    if isinstance(tags, str):
        tags = camel_case_split(tags)
        return [tag.strip() for tag in tags.split(',') if tag.strip()]
    elif isinstance(tags, list):
        return [camel_case_split(tag) for tag in tags]
    return []


def generate_weighted_embeddings(post):
    print(f"generating embeddings for post id {post['id']}")

    tags = pull_tags(post['text'])
    tags = preprocess_tags(tags)
    print(f"tags pulled: {tags}")

    text = clean_text(post['text'])
    print(f"text pulled: {text}")

    goods = post['goods']
    print(f"goods pulled: {goods}")

    tag_embedding = model.encode(" ".join(tags)) if tags else np.zeros(384)
    goods_embedding = model.encode(goods) * 2
    # *2 so we put more weight on the goods that the user wants
    # This can be changed later, hyperparameter tuning is vibes based
    text_embedding = model.encode(text) if text else np.zeros(384)

    combined = np.concatenate([
        tag_embedding,
        goods_embedding,
        text_embedding * 0.3
        # more vibes based hyperparameter tuning
    ])

    return combined


@app.get("/api/py/embed")
def update_post_embeddings():
    # This will need some error handling but for now I think it's ok
    post_query = """SELECT id, text, goods.name as goods
                    FROM posts JOIN goods on goods.id = posts.good_id
                    WHERE embedding IS NULL;"""
    # limit might be needed but unsure how will loop it just yet
    # Will limit things when able

    # stuff for connecting to the database here

    conn = psycopg2.connect(os.getenv("DATABASE_URL"))
    cursor = conn.cursor

    cursor.execute(post_query)
    posts = cursor.fetchall()

    if not posts:
        print("All posts have embeddings")
        return

    update_count = 0

    for post in posts:
        embedding = generate_weighted_embeddings(post)
        cursor.execute("""
            UPDATE posts
            SET embedding = %s
            WHERE id = %s;
        """, (embedding.tolist(), post['id']))
        # Not sure if it needs to be tolist()
        # Since the datatype is a vector.

        update_count += 1

    conn.commit()
    conn.close()
    print(f"{update_count} posts updated succesfully.")

update_post_embeddings()
