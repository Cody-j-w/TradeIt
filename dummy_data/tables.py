import sqlite3
from faker import Faker
import random

fake = Faker()

DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"


conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def table_create():
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        bios TEXT
        )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        tags TEXT,
        text TEXT,
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
    conn.close()


def insert_users():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for _ in range(500):
        cursor.execute("INSERT INTO users (name, email, bios) VALUES (?, ?, ?)",
                       (fake.unique.name(), fake.unique.email(), fake.text()))

    conn.commit()
    conn.close()


def insert_posts():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    tag_list = ["#FreshBread", "#HomeBaked", "#TradeForTacos", "#HomemadeJam", "#SourdoughSwap", "#PianoLessons", "#FixItForTrade", "#HaircutExchange", "#CodeForCoffee", "#TattooTrade", "#CrochetForTrade", "#HandmadeJewelry", "#CustomArtSwap", "#WoodworkBarter", "#DIYExchange", "#LaptopForTrade", "#GamingGearSwap", "#CodeForFood", "#GuitarForGPU", "#TechBarter",
                "#PlantSwap", "#FurnitureTrade", " #DIYToolsExchange", "#HouseholdGoods", "#SeedsForTrade," "#ClothesForTrade", "#SneakerSwap", "#BagBarter", "#StreetwearExchange", "#JewelryTrade", "#BarterLife", "#TradeInstead", "#SkillsNotBills", "#NoMoneyNeeded", "#SwapItLikeItsHot"]

    for user_id in range(1, 501):
        for _ in range(random.randint(1, 5)):
            fake_tags = ", ".join(random.sample(
                tag_list, k=random.randint(1, 3)))
            cursor.execute("INSERT INTO posts (user_id, tags, text) VALUES (?, ?, ?)",
                           (user_id, fake_tags, fake.text()))

    conn.commit()
    conn.close()


def insert_likes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for _ in range(500):
        user_id = random.randint(1, 500)
        post_id = random.randint(1, 2000)
        cursor.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
                       (user_id, post_id))

    conn.commit()
    conn.close()


def insert_follows():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for _ in range(50):
        follower_id, following_id = random.sample(range(1, 501), 2)
        cursor.execute("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)",
                       (follower_id, following_id))

    conn.commit()
    conn.close()


table_create()
print("create function is happy")

insert_users()
print("user function is happy")

insert_posts()
print("post function is happy")

insert_likes()
print("likes function is happy")

insert_follows()
print("follows function is happy")


print("!!! everything worked (: !!!)")
