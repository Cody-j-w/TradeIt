from fastapi import FastAPI

app = FastAPI()

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI!"}