import sqlite3
from faker import Faker
import random
from datetime import datetime, timedelta, time

fake = Faker()

# If you're Sean
DB_PATH = r"C:/Users/seana/OneDrive/Documents/Learning_Playground/Time_data.db"

# If you're Ace
# DB_PATH = r"/home/acequantum/playtime/dummy_data/1_dummy_data.db"

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


def generate_random_dates(start_date, end_date):
    delta = end_date - start_date
    random_days = random.randint(0, delta.days)
    random_date = start_date + timedelta(days=random_days)
    return random_date.strftime('%Y-%m-%d')


start_date = datetime.strptime('2025-03-01', '%Y-%m-%d')
end_date = datetime.strptime('2025-03-31', '%Y-%m-%d')


def generate_random_time():
    hour = random.randint(0, 23)
    minute = random.randint(0, 59)
    second = random.randint(0, 59)
    return time(hour, minute, second)


def insert_users():
    """Inserts unique information for users"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for _ in range(1000):
        cursor.execute("INSERT INTO users (name, email, zip_code, bios) VALUES (?, ?, ?, ?)",
                       (fake.unique.name(), fake.unique.email(), fake.zipcode(), fake.text()))
        cursor.execute("INSERT INTO users (name, email, zip_code, bios) VALUES (?, ?, ?, ?)",
                       (fake.unique.name(), fake.unique.email(), fake.zipcode(), fake.text()))

    conn.commit()
    conn.close()


def insert_posts():
    """Makes post for users, ranfom tags and text for the post"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    trade_tags = [
        "Collectibles", "Fashion & Accessories", "Tech & Gadgets", "Books, Media & Education",
        "Home & Furniture", "Services", "Outdoor & Sporting", "Food & Specialty",
        "DIY & Crafting", "Miscellaneous", "Vehicles & Transportation", "Toys & Games",
        "Music & Instruments", "Pet Supplies", "Health & Wellness", "Office & School Supplies"
    ]

    goods = {
        "Collectibles": [
            "vintageVinylRecords", "rareCoinsOrCurrency", "tradingCards", "comicBooks", "stamps",
            "antiqueJewelry", "actionFigures", "artPrintsPosters", "autographedMemorabilia", "retroToys",
            "vintageMovieProps", "sportsCards", "historicalArtifacts", "militaryCollectibles", "signedBooks",
            "firstEditionBooks", "oldMaps", "modelTrains", "classicBoardGames", "retroElectronics"
        ],
        "Fashion & Accessories": [
            "designerHandbags", "sneakers", "vintageClothing", "watches", "sunglasses",
            "handmadeJewelry", "customClothing", "fashionAccessories", "costumeJewelry", "leatherGoods",
            "formalWear", "belts", "scarves", "limitedEditionShoes", "hats",
            "backpacks", "wallets", "gothicFashion", "punkAccessories", "highEndPerfumes"
        ],
        "Tech & Gadgets": [
            "usedSmartphones", "gamingConsoles", "headphones", "dslrCamerasLenses", "smartHomeDevices",
            "videoGames", "computerParts", "laptops", "mechanicalKeyboards", "fitnessTrackers",
            "powerTools", "graphicCards", "VRHeadsets", "drones", "smartwatches",
            "3DPrinters", "retroGamingConsoles", "eReaders", "studioMicrophones", "projectors",
            "customBuiltPCs", "moddedControllers", "highEndSpeakers", "tabletStands", "mechanicalNumPads"
        ],
        "Books, Media & Education": [
            "books", "bluRaysDvds", "rareManuscripts", "textbooks", "mangaAnimeMerch",
            "graphicNovels", "boardGames", "DNDMaterials", "puzzles", "artSupplies",
            "languageTutoring", "onlineCourses", "codingLessons", "musicalInstruments", "vinylPlayers",
            "sheetMusic", "classicLiterature", "signedNovels", "selfHelpBooks", "cookbooks",
            "educationalKits", "tradingCardGuides", "magazines", "comicArtBooks", "scienceKits"
        ],
        "Home & Furniture": [
            "smallFurniture", "houseplants", "kitchenAppliances", "homeDecor", "antiqueFurniture",
            "handmadeRugs", "vintageLamps", "candlesIncense", "storageSolutions", "wallArt",
            "bathroomAccessories", "bedFrames", "handmadeBlankets", "decorativePillows", "diningSets",
            "smartLighting", "customShelves", "rockingChairs", "beanBags", "patioFurniture"
        ],
        "Services": [
            "graphicDesign", "tutoring", "photographyServices", "handymanRepairs", "petSittingDogWalking",
            "haircut", "webDesign", "customArt", "pianoLessons", "tailoring",
            "mechanicServices", "bikeRepairs", "woodworkingCommissions", "potteryClasses", "voiceActing",
            "digitalMarketing", "resumeWriting", "careerCoaching", "languageTranslation", "fitnessCoaching"
        ],
        "Outdoor & Sporting": [
            "campingGear", "bicyclesBikeParts", "sportsEquipment", "fishingGear", "hikingGear",
            "surfboards", "skateboards", "scooterParts", "paintballEquipment", "snowboardingGear",
            "rockClimbingGear", "kayaks", "bmxBikes", "longboards", "airsoftGuns",
            "huntingEquipment", "tentCampingSupplies", "archeryGear", "selfDefenseTools", "outdoorCookingSets"
        ],
        "Food & Specialty": [
            "gourmetFoodItems", "bread", "freshProduce", "homemadePreserves", "bakedGoods",
            "coffeeBeans", "artisanalCheese", "localHoney", "exoticSpices", "homemadeSweets",
            "fermentedFoods", "rareTeaLeaves", "chocolateGiftBoxes", "premiumMeats", "veganSnacks",
            "spicySauces", "customCakeOrders", "locallyRoastedCoffee", "pickledGoods", "foodSubscriptionBoxes"
        ],
        "DIY & Crafting": [
            "craftSupplies", "perfumesColognes", "diyTools", "knittingSupplies", "sewingMachines",
            "scrapbookingMaterials", "clayModelingKits", "embroideryKits", "customStickers", "jewelryMakingKits",
            "handmadePaper", "candleMakingSupplies", "resinArtKits", "woodburningTools", "soapMakingKits",
            "glassEtchingTools", "potteryWheels", "metalStampingKits", "customPins", "origamiSets"
        ],
        "Miscellaneous": [
            "vintagePostcards", "tattooDesigns", "collectiblePins", "rareBoardGames", "concertMerch",
            "horrorMemorabilia", "localArt", "recordingEquipment", "handmadeSoap", "customToys",
            "steampunkAccessories", "fantasyMerch", "cosplayArmor", "hobbyistDrones", "paranormalEquipment",
            "sciFiProps", "magicTricks", "tarotCards", "fortuneTellingItems", "oldArcadeMachines"
        ],
        "Vehicles & Transportation": [
            "bicycleParts", "carParts", "motorcycleHelmets", "skateboardWheels", "scooters",
            "usedBicycles", "electricSkateboards", "vintageCars", "motorcycleJackets", "customCarDecals",
            "eBikes", "hoverboards", "classicMotorcycles", "carAudioEquipment", "offroadGear",
            "campingTrailers", "ATVAccessories", "autoDetailingKits", "roofRacks", "truckBedCovers"
        ],
        "Toys & Games": [
            "legoSets", "boardGames", "actionFigures", "stuffedAnimals", "modelKits",
            "RCCars", "retroVideoGames", "dollHouses", "puzzles", "tabletopRPGSets",
            "kidsToys", "collectorDolls", "gamingMiniatures", "tradingCardStorage", "arcadeMachines"
        ],
        "Music & Instruments": [
            "electricGuitars", "acousticGuitars", "violins", "drumKits", "synthesizers",
            "guitarPedals", "ukuleles", "bassGuitars", "djEquipment", "karaokeMachines",
            "flutes", "brassInstruments", "musicRecordingSoftware", "mixingBoards", "turntables"
        ],
        "Pet Supplies": [
            "dogToys", "catTrees", "birdCages", "fishTanks", "hamsterWheels",
            "reptileTerrariums", "customPetTags", "handmadePetClothing", "petCarriers", "automaticFeeders"
        ],
        "Health & Wellness": [
            "gymEquipment", "yogaMats", "essentialOils", "massageTools", "supplements",
            "meditationAccessories", "sleepAids", "ergonomicChairs", "fitnessWearables", "weightLiftingGear"
        ],
        "Office & School Supplies": [
            "officeChairs", "desks", "backpacks", "fountainPens", "notebooks",
            "calculator", "plannerJournals", "whiteboards", "studyGuides", "ergonomicKeyboards"
        ]
    }

    goods = {
        "Collectibles": [
            "vintageVinylRecords", "rareCoinsOrCurrency", "tradingCards", "comicBooks", "stamps",
            "antiqueJewelry", "actionFigures", "artPrintsPosters", "autographedMemorabilia", "retroToys",
            "vintageMovieProps", "sportsCards", "historicalArtifacts", "militaryCollectibles", "signedBooks",
            "firstEditionBooks", "oldMaps", "modelTrains", "classicBoardGames", "retroElectronics"
        ],
        "Fashion & Accessories": [
            "designerHandbags", "sneakers", "vintageClothing", "watches", "sunglasses",
            "handmadeJewelry", "customClothing", "fashionAccessories", "costumeJewelry", "leatherGoods",
            "formalWear", "belts", "scarves", "limitedEditionShoes", "hats",
            "backpacks", "wallets", "gothicFashion", "punkAccessories", "highEndPerfumes"
        ],
        "Tech & Gadgets": [
            "usedSmartphones", "gamingConsoles", "headphones", "dslrCamerasLenses", "smartHomeDevices",
            "videoGames", "computerParts", "laptops", "mechanicalKeyboards", "fitnessTrackers",
            "powerTools", "graphicCards", "VRHeadsets", "drones", "smartwatches",
            "3DPrinters", "retroGamingConsoles", "eReaders", "studioMicrophones", "projectors",
            "customBuiltPCs", "moddedControllers", "highEndSpeakers", "tabletStands", "mechanicalNumPads"
        ],
        "Books, Media & Education": [
            "books", "bluRaysDvds", "rareManuscripts", "textbooks", "mangaAnimeMerch",
            "graphicNovels", "boardGames", "DNDMaterials", "puzzles", "artSupplies",
            "languageTutoring", "onlineCourses", "codingLessons", "musicalInstruments", "vinylPlayers",
            "sheetMusic", "classicLiterature", "signedNovels", "selfHelpBooks", "cookbooks",
            "educationalKits", "tradingCardGuides", "magazines", "comicArtBooks", "scienceKits"
        ],
        "Home & Furniture": [
            "smallFurniture", "houseplants", "kitchenAppliances", "homeDecor", "antiqueFurniture",
            "handmadeRugs", "vintageLamps", "candlesIncense", "storageSolutions", "wallArt",
            "bathroomAccessories", "bedFrames", "handmadeBlankets", "decorativePillows", "diningSets",
            "smartLighting", "customShelves", "rockingChairs", "beanBags", "patioFurniture"
        ],
        "Services": [
            "graphicDesign", "tutoring", "photographyServices", "handymanRepairs", "petSittingDogWalking",
            "haircut", "webDesign", "customArt", "pianoLessons", "tailoring",
            "mechanicServices", "bikeRepairs", "woodworkingCommissions", "potteryClasses", "voiceActing",
            "digitalMarketing", "resumeWriting", "careerCoaching", "languageTranslation", "fitnessCoaching"
        ],
        "Outdoor & Sporting": [
            "campingGear", "bicyclesBikeParts", "sportsEquipment", "fishingGear", "hikingGear",
            "surfboards", "skateboards", "scooterParts", "paintballEquipment", "snowboardingGear",
            "rockClimbingGear", "kayaks", "bmxBikes", "longboards", "airsoftGuns",
            "huntingEquipment", "tentCampingSupplies", "archeryGear", "selfDefenseTools", "outdoorCookingSets"
        ],
        "Food & Specialty": [
            "gourmetFoodItems", "bread", "freshProduce", "homemadePreserves", "bakedGoods",
            "coffeeBeans", "artisanalCheese", "localHoney", "exoticSpices", "homemadeSweets",
            "fermentedFoods", "rareTeaLeaves", "chocolateGiftBoxes", "premiumMeats", "veganSnacks",
            "spicySauces", "customCakeOrders", "locallyRoastedCoffee", "pickledGoods", "foodSubscriptionBoxes"
        ],
        "DIY & Crafting": [
            "craftSupplies", "perfumesColognes", "diyTools", "knittingSupplies", "sewingMachines",
            "scrapbookingMaterials", "clayModelingKits", "embroideryKits", "customStickers", "jewelryMakingKits",
            "handmadePaper", "candleMakingSupplies", "resinArtKits", "woodburningTools", "soapMakingKits",
            "glassEtchingTools", "potteryWheels", "metalStampingKits", "customPins", "origamiSets"
        ],
        "Miscellaneous": [
            "vintagePostcards", "tattooDesigns", "collectiblePins", "rareBoardGames", "concertMerch",
            "horrorMemorabilia", "localArt", "recordingEquipment", "handmadeSoap", "customToys",
            "steampunkAccessories", "fantasyMerch", "cosplayArmor", "hobbyistDrones", "paranormalEquipment",
            "sciFiProps", "magicTricks", "tarotCards", "fortuneTellingItems", "oldArcadeMachines"
        ],
        "Vehicles & Transportation": [
            "bicycleParts", "carParts", "motorcycleHelmets", "skateboardWheels", "scooters",
            "usedBicycles", "electricSkateboards", "vintageCars", "motorcycleJackets", "customCarDecals",
            "eBikes", "hoverboards", "classicMotorcycles", "carAudioEquipment", "offroadGear",
            "campingTrailers", "ATVAccessories", "autoDetailingKits", "roofRacks", "truckBedCovers"
        ],
        "Toys & Games": [
            "legoSets", "boardGames", "actionFigures", "stuffedAnimals", "modelKits",
            "RCCars", "retroVideoGames", "dollHouses", "puzzles", "tabletopRPGSets",
            "kidsToys", "collectorDolls", "gamingMiniatures", "tradingCardStorage", "arcadeMachines"
        ],
        "Music & Instruments": [
            "electricGuitars", "acousticGuitars", "violins", "drumKits", "synthesizers",
            "guitarPedals", "ukuleles", "bassGuitars", "djEquipment", "karaokeMachines",
            "flutes", "brassInstruments", "musicRecordingSoftware", "mixingBoards", "turntables"
        ],
        "Pet Supplies": [
            "dogToys", "catTrees", "birdCages", "fishTanks", "hamsterWheels",
            "reptileTerrariums", "customPetTags", "handmadePetClothing", "petCarriers", "automaticFeeders"
        ],
        "Health & Wellness": [
            "gymEquipment", "yogaMats", "essentialOils", "massageTools", "supplements",
            "meditationAccessories", "sleepAids", "ergonomicChairs", "fitnessWearables", "weightLiftingGear"
        ],
        "Office & School Supplies": [
            "officeChairs", "desks", "backpacks", "fountainPens", "notebooks",
            "calculator", "plannerJournals", "whiteboards", "studyGuides", "ergonomicKeyboards"
        ]
    }

    for user_id in range(1, 1001):
        for _ in range(random.randint(1, 25)):
            post_type = random.choice(["UFT", "ISO", "Service"])
            item_offered_tag = random.choice(trade_tags)
            item_wanted_tag = random.choice(trade_tags)
            item_offered = random.choice(goods[item_offered_tag])
            item_wanted = random.choice(goods[item_wanted_tag])

        for _ in range(random.randint(1, 25)):
            post_type = random.choice(["UFT", "ISO", "Service"])
            item_offered_tag = random.choice(trade_tags)
            item_wanted_tag = random.choice(trade_tags)
            item_offered = random.choice(goods[item_offered_tag])
            item_wanted = random.choice(goods[item_wanted_tag])

            if post_type == "UFT":
                text = f"UFT: {item_offered}, Wanting: {item_wanted}."
                text = f"UFT: {item_offered}, Wanting: {item_wanted}."
            elif post_type == "ISO":
                text = f"ISO: {item_wanted}, Offering: {item_offered}."
                text = f"ISO: {item_wanted}, Offering: {item_offered}."
            else:
                text = f"Offering {item_offered} services, looking for {item_wanted}."

            trade_status = "successful" if random.random() < 0.2 else "open"
            trade_status = "successful" if random.random() < 0.2 else "open"

            cursor.execute(
                "INSERT INTO posts (user_id, trade_status, tags, goods, date_posted, time_posted, text) VALUES (?, ?, ?, ?, ?, ?, ?)",
                (user_id, trade_status, item_offered_tag, item_offered, generate_random_dates(
                    start_date, end_date), generate_random_time().strftime('%H:%M:%S'), text)
            )

    # Ok so good news
    # Cody has attributed a "goods" field in place of relying on tags to have goods.
    # Obvi people could use tags
    # but having a field that is specifically a good or service makes things easier for him and for us.
    # If we go with goods we won't have to worry about having to pre-process tags as they are now
    # Instead we'll be looking directly at the goods field
    # Anyway I'm going to make a new file for preprocessing now.

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
