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
from typing import Optional, List
from datetime import datetime

# import cosine_similarity as cos_sim

app = FastAPI()

# Connecting to database
def get_db_connection():
    conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
    return conn

# All of these will be changed when I see what the API calls look like
# These are for JSONifying the data to be returned in an API call later.
class UserProfile(BaseModel):
    user_id: int
    name: str
    avatar: str
    # avatar data type will more than likely be changed

class PostRecommendation(BaseModel):
    post_id: int
    text: str
    goods: str
    image: str #Once again this will more than likely be changed
    created_at: datetime
    user: UserProfile

# This is taking the list of post IDs gathered in get_recommendations
# And running them through a SQL query to get all the post info
# Then JSONifying it to return as an API call
def aggrigate_and_JSONify(post_ids, conn):
    cursor = conn.cursor()

    cursor.execute("""
        -- This entire query will need to be adjusted
        SELECT p.id, p.text, p.timestamp, p.image,
            goods.name as goods, u.name, u.image
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
                "post_id": row[0],
                "text": row[1],
                "timestamp": row[2],
                "image": row[3],
                "goods": row[4],
                "user": {
                    "name": row[5],
                    "avatar": row[6]
                },
        })

    return populated_post_recs



# @app.get("/recommendations/{user_id}", response_model=List[PostRecommendation])
# I genuinely do NOT understand this.
# How have I been so stupid for this long?
# Or rather, how have I been over thinking this for this long?
# Need me some brain smoother.
def get_recommendations(user_id):
    conn = get_db_connection()
    # cursor = conn.cursor()
    # Need cursor if not use cursor here?
    # Does not appear so.

    post_id_recs = []

    cos_sim_recs = cos_sim.recommend_cosine_sim(user_id, conn)

    post_id_recs.append(cos_sim_recs)

    # Here's where we would call Sean's other functions
    # and append them to a list

    populated_post_recs = aggrigate_and_JSONify(post_id_recs, conn)

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
