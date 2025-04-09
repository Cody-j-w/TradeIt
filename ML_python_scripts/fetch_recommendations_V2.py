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
            goods.name as goods, u.id AS user_id, u.name, u.avatar
        FROM posts p
        JOIN goods on goods.id = p.good_id
        JOIN users u ON p.user_id = u.id
        WHERE p.id = ANY(%s)
        GROUP BY p.id, u.id
    """, (post_ids,))

    post_details = cursor.fetchall()

    conn.close()

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
                    "user_id": row[5],
                    "name": row[6],
                    "avatar": row[7]
                },
        })
    
    # Below is code that I don't think I need.
    # It may be cut out before the next push.
    # # That will also need to be rewritten
    # #   But why?
    # #   What did past Ace know that I don't?
    # #   
    # populated_post_reqs = []
    # for post_id in post_details:
    #     if post_id in details_lookup:
    #         post_data = details_lookup[post_id]
    #         populated_post_reqs.append({
    #             "post_id": post_id,
    #             "text": post_data["text"],
    #             "goods": post_data["goods"],
    #             "timestamp": post_data["timestamp"],
    #             "image": post_data["image"],
    #             "user": post_data["user"]
    #         })

    return populated_post_recs



@app.get("/recommendations/{user_id}", response_model=List[PostRecommendation])
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

    return populated_post_recs
