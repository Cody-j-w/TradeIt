#!/usr/bin/env python3

# This script is solely to get the list of post IDs
# From a similarity score and return them
# I do want to at some point throw some conditional timing on there
# Now is not the time though

# These are probably fine to comment out but idk
import psycopg2
import os

# Unsure why I have this commented out
# Oh yeah I set it up to have the conn passed into it
# def get_db_connection():
#     conn = psycopg2.connect(os.getenv("POSTGRES_URL"))
#     return conn

# I know that a clean programmer would put that in a utility file
# And call it when they need it from that file
# But I am not a clean programmer. The fact this is being broken into 3 files is already a miracle
# So it's going to exist in every one of these.
#   Ok so future Ace here
#   That might not be the play just because having one connection will make things cheaper
#   I also won't have to remember everywhere to close it
#   So uh... stand by for details.

def recommend_cosine_sim(user_id, conn):
    # ACE
    # MAKE SURE YOU ONLY PULL POSTS WITH EMBEDDINGS
    # OTHERWISE THINGS MAY BREAK
    cursor = conn.cursor()

    cursor.execute("""
        SELECT p.id, 1 - (p.embedding <=> u_avg.avg_embedding) AS similarity -- selecting post IDs and Embeddings
        FROM posts p
        CROSS JOIN (
            SELECT AVG(embedding) AS avg_embedding
            FROM posts
            WHERE id IN (
                SELECT post_id 
                FROM posts_likes 
                WHERE user_id = %s::uuid
            )
            AND embedding IS NOT NULL
        ) u_avg -- Average of the user embeddings (average of the things they like)
        WHERE p.id NOT IN (
            SELECT post_id 
            FROM posts_likes 
            WHERE user_id = %s::uuid
        ) -- getting posts the user hasn't already liked
        AND p.embedding IS NOT NULL
        -- this is where I'd include datetime limits I think. Only recommend recent posts, you know?
        ORDER BY similarity DESC
        LIMIT 10
    """, (user_id, user_id))
    recommended_posts = cursor.fetchall()

    post_id_list = [post[0] for post in recommended_posts]

    conn.close()

    return post_id_list

# Ok I *THINK* that's it.
# No way to be sure until we're able to test things unfortunately.
