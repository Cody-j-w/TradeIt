import sqlite3

# If you're Sean
DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

# If you're Ace
# DB_PATH = r"/home/acequantum/playtime/dummy_data/1_dummy_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def table_create(conn):
    """Creating tables for test dummy data"""
    try:
        cursor.execute('''CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT,
            zip_code INT(5),
            bios TEXT
            )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            trade_status TEXT,
            tags TEXT,
            text TEXT,
            goods TEXT,
            date_posted DATE,
            time_posted TIME,
            FOREIGN KEY (user_id) REFERENCES users(id)
            )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS likes (
            user_id INTEGER,
            post_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users(id)
            FOREIGN KEY (post_id) REFERENCES posts(id)
            )''')

        cursor.execute('''CREATE TABLE IF NOT EXISTS follows (
            follower_id INTEGER,
            following_id INTEGER,
            FOREIGN KEY (follower_id) REFERENCES users(id),
            FOREIGN KEY (following_id) REFERENCES users(id)
            )''')
        conn.commit()
        print("Tables were successfully created")
    except sqlite3.Error as e:
        print(f"Error creating tables: {e}")
    finally:
        conn.close()


def destroy_tables(conn):
    """Just in case you need to delete all sqlite tables"""
    try:
        cursor.executescript('''
                       DROP TABLE IF EXISTS users;
                       DROP TABLE IF EXISTS posts;
                       DROP TABLE IF EXISTS likes;
                       DROP TABLE IF EXISTS follows;
                       ''')
        conn.commit()
        print("Tables dropped successfully.")
    except sqlite3.Error as e:
        print(f"Error dropping tables: {e}")
    finally:
        conn.close

# WILL CREATE THE TABLES
# table_create(conn)

# ! WARNING WILL KILL THE POOR TABLES. ps they had familys
# destroy_tables(conn)
