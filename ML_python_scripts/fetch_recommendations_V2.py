#!/usr/bin/env python3

# Going into this with a little bit more of a clear head.
# I still don't know what I'm doing, but at least a little bit less so
# Or more so? Not sure how that works out really.

# Anyway, this script is what calls for the different bits and bobs
# And returns them
# It's got the models that will hold the data to be returned
# As well as the SQL Query to gather the posts based on post IDs.

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2

import os
from dotenv import main
from typing import Optional, List
from uuid import UUID
from datetime import datetime
import random

from .cosine_similarity import recommend_cosine_sim
from .data_fetchers import *

main.load_dotenv()
app = FastAPI()

# Connecting to database
def get_db_connection():
    db_url = os.getenv("POSTGRES_URL")
    if not db_url:
        raise ValueError(f"Not da db. Da db: {db_url}")

    print(f"Attempting to connect to database url")

    try:
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"failed to connect to database: {e}")
        raise
    # conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
    # return conn

# All of these will be changed when I see what the API calls look like
# These are for JSONifying the data to be returned in an API call later.
class UserProfile(BaseModel):
    user_id: UUID
    name: str
    avatar: str
    # avatar data type will more than likely be changed

class PostRecommendation(BaseModel):
    id: UUID
    text: str
    timestamp: datetime
    image: Optional[str] #Once again this will more than likely be changed
    type: str
    goods: str
    user: UserProfile

# This is taking the list of post IDs gathered in get_recommendations
# And running them through a SQL query to get all the post info
# Then JSONifying it to return as an API call
def aggrigate_and_JSONify(post_ids, conn):
    cursor = conn.cursor()

    cursor.execute("""
        -- This entire query will need to be adjusted
        SELECT p.id, p.text, p.timestamp, p.image, p.type,
            goods.name as goods, u.id as user_id,
            u.name, u.image as user_avatar
        FROM posts p
        JOIN goods on goods.id = p.good_id
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ANY(%s::uuid[]);
    """, (post_ids,))

    post_details = cursor.fetchall()

    # Not sure if there needs to be a change in how row[0] works
    # Just because it feels weird that it's not got a name.

    populated_post_recs = []
    for row in post_details:
        populated_post_recs.append({
                "id": row[0],
                "text": row[1],
                "timestamp": row[2],
                "image": row[3] if row[3] else None,
                "type": row[4],
                "goods": row[5],
                "user": {
                    "user_id": row[6],
                    "name": row[7],
                    "avatar": row[8]
                },
        })

    return populated_post_recs


# I genuinely do NOT understand this.
# How have I been so stupid for this long?
# Or rather, how have I been over thinking this for this long?
# Need me some brain smoother.
def get_recommendations(user_id):

    # Debug print to ensure we got here
    print("Found function")

    conn = get_db_connection()
    # Need cursor if not use cursor here?
    # Does not appear so.

    post_id_recs = []

    cos_sim_recs = recommend_cosine_sim(user_id, conn)
    post_id_recs.append(cos_sim_recs)
    
    # Sean's set
    # This will also be added in later
    # following_recs = data_fetchers.get_recent_followers_by_user(user_id=user_id, conn=conn)
    # post_id_recs.append(following_recs)

    zipcode_recs = get_recent_posts_by_zipcode(user_id=user_id, conn=conn)
    post_id_recs.append(zipcode_recs)

    recently_liked_recs = get_recent_posts_by_liked_profiles(user_id=user_id, conn=conn)
    post_id_recs.append(recently_liked_recs)

    recent_posts = get_recent_posts_by_week(user_id=user_id, conn=conn)
    post_id_recs.append(recent_posts)

    # These will turn on later
    # tags_liked_recs = data_fetchers.get_weighted_tags_from_liked_posts(user_id=user_id, conn=conn)
    # post_id_recs.append(tags_liked_recs)

    flattened_posts_recs = [item for sublist in post_id_recs for item in sublist]

    # Remove duplicate post IDs
    post_id_recs = list(dict.fromkeys(flattened_posts_recs))

    populated_post_recs = aggrigate_and_JSONify(post_id_recs, conn)

    # Time to shuffle
    random.shuffle(populated_post_recs)

    conn.close()

    return populated_post_recs

def test_jsonify():
    # This is designed to grab post info for the jsonify function.
    # I already know the jsonify function will need to change

    conn = get_db_connection()
    cursor = conn.cursor()

    test_posts = []

    cursor.execute("""
        SELECT id FROM posts;
                   """)
    
    test_posts = cursor.fetchall()

    populated_test_posts = aggrigate_and_JSONify(test_posts, conn)

    conn.close()

    return populated_test_posts
