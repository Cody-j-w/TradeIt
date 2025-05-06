# API we're working with
from fastapi import FastAPI

# imports for generating embeddings
from ML_python_scripts.fetch_recommendations_V2 import test_jsonify, get_recommendations, PostRecommendation
from typing import List

# imports for fetching the recommended posts
# from ML_python_scripts.fetch_recommendations_V2 import get_recommendations, UserProfile, PostRecommendation
# from typing import List

# setting up the app.
app = FastAPI()

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI!"}

# I genuinely have no idea what I'm doing but I think it is that simple.
@app.get("/api/py/recommendations/{user_id}", response_model=List[PostRecommendation])
def fetch_recommendations(user_id):
    try:
        print("API call made it through for user ID:")
        print(user_id)
        recommended_posts = get_recommendations(user_id)

        return recommended_posts
    except:
        print("Issue with server")

# Still no idea what I'm doing but we're gonna give it our best.
@app.get("/api/py/test_json")
def testing_json():
    test_results = test_jsonify()
    return test_results
