#!/usr/bin/env python3

# I once again don't actually know if we need the shebang
# I also once again want to make it clear
# I do not know what I am doing
# We've never had to actually do anything with our input in ML

# Anyway here's some imports
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import psycopg2
# This is again something that I don't know if I need to download

import os
from typing import Optional, List
from datetime import datetime

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

# This is where I'm still not sure I understand things
# We will also at this point need to integrate some of the smaller scripts Sean is working on atm
# We'll probably put those in a different file and call them to here.
# I'm thankful for the postgres ability to call cosine similarity right there in the query
# Otherwise we'd be pulling all posts.
# Anyway enough talking to a void.

# I'll be honest I don't super understand what that is,
# It reminds me of T2 and I don't like it.
# Ok nvm I do kind of get it. T2 Ace could've used this understanding
# Poor guy had to be confused for all of that.
@app.get("/recommendations/{user_id}", response_model=List[PostRecommendation])
def get_recommendations(user_id: int, top_k: int = 5):
    # user_id will potentially need to be changed
    # I may also change the top_k var to instead be hard coded in the function
    # Simply because we're also going to be including Sean's smaller functions.
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # This is where we will need to change some things as far as queries
        # Simply because I don't fully know what the database looks like
        # Anyway here's wonderwall
        cursor.execute("""
            SELECT p.id, 1 - (p.embedding <=> u_avg.avg_embedding) AS similarity -- selecting post IDs and Embeddings
            FROM posts p
            CROSS JOIN (
                SELECT AVG(embedding) AS avg_embedding
                FROM posts
                WHERE id IN (SELECT post_id FROM likes WHERE user_id = %s)
            ) u_average -- Average of the user embeddings (average of the things they like)
            WHERE p.id NOT IN (SELECT post_id FROM likes WHERE user_id = %s) -- getting posts the user hasn't already liked
             -- this is where I'd include datetime limits I think. Only recommend recent posts, you know?
            ORDER BY similarity DESC
            LIMIT %s
        """, (user_id, user_id, top_k))
        recommended_posts = cursor.fetchall()

        if not recommended_posts:
            recommended_posts = []
            # so we can then append Sean's functions 
            # rather than returning an empty list.

        post_ids = [post[0] for post in recommended_posts]

        # This is where we'd put the functions Sean's working on
        # Again, probably as calls to a different script.
        # I guess we'll just append the lists from Sean's function
        # Should be easy

        cursor.execute("""
            -- This is again going to need to be changed when I can see
            -- what the data looks like on the database side
            SELECT p.id, p.text, p.goods, p.created_at,
                    u.id AS user_id, u.name, u.avatar,
                    ARRAY_AGG(i.url) AS image_urls
                    -- I KNOW that the image is wrong, so that will def need to be changed
            FROM posts p
            JOIN users u ON p.user_id = u.id
            LEFT JOIN images i ON p.id = i.post_id
            -- Ok just assume anything with images needs to be changed
            -- Because neither I nor Cody know what image storage looks like yet.
            WHERE p.id = ANY(%s)
            GROUP BY p.id, u.id
        """, (post_ids,))

        post_details = cursor.fetchall()

        # Combining results to then return in JSON
        details_lookup = {row[0]: row for row in post_details}
        recommendations = []
        for post_id, similarity in recommended_posts:
            if post_id in details_lookup:
                details = details_lookup[post_id]
                recommendations.append({
                    # This is another place things will need to be changed
                    # When we get a look at the database schema
                    "post_id": post_id,
                    "text": details[1],
                    "goods": details[3],
                    "created_at": details[4],
                    "images": details[8],
                    "user": {
                        "user_id": details[5],
                        "name": details[6],
                        "avatar": details[7]
                    }
                })
        return recommendations

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close
