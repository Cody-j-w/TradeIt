import sqlite3
from faker import Faker
import random
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

fake = Faker()

# If you're Sean
DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

# If you're Ace
# DB_PATH = r"/home/acequantum/playtime/dummy_data/1_dummy_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def table_create():
    """Creating tables for test dummy data"""
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        bios TEXT
        )''')

    cursor.execute('''CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        trade_status TEXT,
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
    """Inserts unique information for users"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for _ in range(1000):
        cursor.execute("INSERT INTO users (name, email, bios) VALUES (?, ?, ?)",
                       (fake.unique.name(), fake.unique.email(), fake.text()))

    conn.commit()
    conn.close()


def insert_posts():
    """Makes post for users, ranfom tags and text for the post"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    trade_tags = [
        # Collectibles
        "vintageVinylRecords", "rareCoinsOrCurrency", "tradingCards", "comicBooks", "stamps",
        "antiqueJewelry", "actionFigures", "artPrintsPosters", "autographedMemorabilia", "retroToys",

        # Fashion & Accessories
        "designerHandbags", "sneakers", "vintageClothing", "watches", "sunglasses",
        "handmadeJewelry", "customClothing", "fashionAccessories", "costumeJewelry", "leatherGoods",

        # Tech & Gadgets
        "usedSmartphones", "gamingConsoles", "headphones", "dslrCamerasLenses", "smartHomeDevices",
        "videoGames", "computerParts", "laptops", "mechanicalKeyboards", "fitnessTrackers",
        "powerTools", "graphicCards", "VRHeadsets", "drones", "smartwatches",

        # Books, Media & Education
        "books", "bluRaysDvds", "rareManuscripts", "textbooks", "mangaAnimeMerch",
        "graphicNovels", "boardGames", "DNDMaterials", "puzzles", "artSupplies",
        "languageTutoring", "onlineCourses", "codingLessons", "musicalInstruments", "vinylPlayers",

        # Home & Furniture
        "smallFurniture", "houseplants", "kitchenAppliances", "homeDecor", "antiqueFurniture",
        "handmadeRugs", "vintageLamps", "candlesIncense", "storageSolutions", "wallArt",

        # Services
        "graphicDesign", "tutoring", "photographyServices", "handymanRepairs", "petSittingDogWalking",
        "haircut", "webDesign", "customArt", "pianoLessons", "tailoring",
        "mechanicServices", "bikeRepairs", "woodworkingCommissions", "potteryClasses", "voiceActing",

        # Outdoor & Sporting
        "campingGear", "bicyclesBikeParts", "sportsEquipment", "fishingGear", "hikingGear",
        "surfboards", "skateboards", "scooterParts", "paintballEquipment", "snowboardingGear",

        # Food & Specialty
        "gourmetFoodItems", "bread", "freshProduce", "homemadePreserves", "bakedGoods",
        "coffeeBeans", "artisanalCheese", "localHoney", "exoticSpices", "homemadeSweets",

        # DIY & Crafting
        "craftSupplies", "perfumesColognes", "diyTools", "knittingSupplies", "sewingMachines",
        "scrapbookingMaterials", "clayModelingKits", "embroideryKits", "customStickers", "jewelryMakingKits",

        # Miscellaneous
        "vintagePostcards", "tattooDesigns", "collectiblePins", "rareBoardGames", "concertMerch",
        "horrorMemorabilia", "localArt", "recordingEquipment", "handmadeSoap", "customToys"
    ]

    for user_id in range(1, 1001):
        for _ in range(random.randint(1, 25)):  # ! Each user makes 1 - 25 posts
            # selects random post type then offered item, and wanted item.
            post_type = random.choice(["UTF", "ISO", "Service"])
            item_offered = random.choice(trade_tags)
            item_wanted = random.choice(trade_tags)

            # generates structured post text
            if post_type == "UFT":
                text = f"UFT: {item_offered}, ISO: {item_wanted}."
            elif post_type == "ISO":
                text = f"ISO: {item_wanted}, UFT: {item_offered}."
            else:
                text = f"Offering {item_offered} services, looking for {item_wanted}."

            trade_status = "successful" if random.random(
            ) < 0.2 else "open"  # roughly 20% sucess rate

            cursor.execute(
                "INSERT INTO posts (user_id, trade_status, tags, text) VALUES (?, ?, ?, ?)",
                (user_id, trade_status, item_offered, text))

    conn.commit()
    conn.close()


def insert_likes():
    """makes fake likes from users to posts"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for _ in range(12500):  # 12500 random likes
        user_id = random.randint(1, 1000)  # users to like posts
        post_id = random.randint(1, 12500)  # posts for users to like
        cursor.execute("INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
                       (user_id, post_id))

    conn.commit()
    conn.close()


def insert_follows():
    """Makes fake users have relationships between each other"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for _ in range(4000):  # 2000 random follow relationships
        follower_id, following_id = random.sample(range(1, 2001), 2)
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

print("!!! everything worked !!!)")
