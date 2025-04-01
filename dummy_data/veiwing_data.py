import sqlite3
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt


# If you're Sean
# DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

# If you're Ace
DB_PATH = r"/home/acequantum/playtime/dummy_data/1_dummy_data.db"


def data_overveiw():
    conn = sqlite3.connect(DB_PATH)

    df_posts = pd.read_sql_query(
        "SELECT user_id, COUNT(*) AS post_count FROM posts GROUP BY user_id", conn
    )
    mean_posts = df_posts["post_count"].mean()
    median_posts = df_posts["post_count"].median()
    min_posts = df_posts["post_count"].min()
    max_posts = df_posts["post_count"].max()

    df_likes = pd.read_sql_query(
        "SELECT user_id, COUNT(*) AS like_count FROM likes GROUP BY user_id", conn
    )
    mean_likes = df_likes["like_count"].mean()
    median_likes = df_likes["like_count"].median()
    min_likes = df_likes["like_count"].min()
    max_likes = df_likes["like_count"].max()

    df_follows = pd.read_sql_query(
        "SELECT follower_id, COUNT(*) AS follow_count FROM follows GROUP BY follower_id", conn
    )
    mean_follows = df_follows["follow_count"].mean()
    median_follows = df_follows["follow_count"].median()
    min_follows = df_follows["follow_count"].min()
    max_follows = df_follows["follow_count"].max()

    df_likes_per_tag = pd.read_sql_query(
        """
        SELECT posts.tags, COUNT(likes.post_id) AS like_count
        FROM posts
        JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.tags
        ORDER BY like_count DESC
        """,
        conn
    )

    post_most_likes = pd.read_sql_query(
        """
        SELECT posts.id AS post_id, COUNT(likes.post_id) AS like_count
        FROM posts
        JOIN likes ON posts.id = likes.post_id
        GROUP BY posts.id
        ORDER BY like_count DESC
        """,
        conn
    )

    conn.close()

    print(
        f"\nMean posts per user: {mean_posts},\nMedian posts per user: {median_posts},\nMin posts per user: {min_posts}\nMax posts per user: {max_posts}\n")
    print(
        f"Mean likes per user: {mean_likes},\nMedian likes per user: {median_likes},\nMin likes per user: {min_likes}\nMax likes per user: {max_likes}\n")
    print(
        f"Mean follows per user: {mean_follows},\nMedian follows per user: {median_follows},\nMin follows per user: {min_follows}\nMax follows per user: {max_follows}\n")
    print(df_likes_per_tag)
    print(post_most_likes)

    return df_posts, df_likes, df_follows


data_overveiw()


df_posts, df_likes, df_follows = data_overveiw()

plt.figure(figsize=(12, 6))

sns.kdeplot(df_posts["post_count"],
            label="Posts per user", fill=True, bw_adjust=0.5)
sns.kdeplot(df_likes["like_count"],
            label="likes per user", fill=True, bw_adjust=0.5)
sns.kdeplot(df_follows["follow_count"],
            label="follows per user", fill=True, bw_adjust=0.5)

plt.xlabel("Count")
plt.ylabel("Density")
plt.title("User Activity Distribution (Posts, Likes, Follows)")
plt.legend()
plt.show()
