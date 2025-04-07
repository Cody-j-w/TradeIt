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

import cosine_similarity as cos_sim

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
    avatar_url: str
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
def aggrigate_and_JSONify(post_ids):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        -- This entire query will need to be adjusted
        SELECT p.id, p.text, p.goods, p.created_at,
            u.id AS user_id, u.name, u.avatar,
            ARRAY_AGG(i.url) AS image_urls
             -- Images call will need to change
        FROM posts p
        JOIN users u ON p.user_id = u.id
        LEFT JOIN images i ON p.id = i.post_id
        WHERE p.id = ANY(%s)
        GROUP BY p.id, u.id
    """, (post_ids,))

    post_details = cursor.fetchall()

    conn.close()

    details_lookup = {
        row[0]: {
            "text": row[1],
            "goods": row[2],
            "created_at": row[3],
            "user": {
                "user_id": row[4],
                "name": row[5],
                "avatar": row[6]
            },
            "image": row[8]
        }
        for row in post_details
    }
    # That will also need to be rewritten

    


@app.get("/recommendations/{user_id}", response_model=List[PostRecommendation])
def get_recommendations(user_id):

