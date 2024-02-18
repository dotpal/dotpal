from fastapi import FastAPI
import uvicorn
from .schemas import User, Coordinate
from datetime import datetime

user_1 = {
    "username": "user_1",
    "email": "user1@user.email",
    "original_id": "npm-rendezvous",
    "coordinate": {"lat": 35.6895, "lon": 139.691},
    "created_at": datetime.now(),
}

user_2 = {
    "username": "user_2",
    "email": "ericCartman@eric.us",
    "original_id": "fatAss752",
    "coordinate": {"lat": 35.6895, "lon": 139.695},
    "created_at": datetime.now(),
}

user_3 = {
    "username": "user_3",
    "email": "cto@gmail.com",
    "original_id": "Chris Chang",
    "coordinate": {"lat": 35.6895, "lon": 139.6918},
    "created_at": datetime.now(),
}

app = FastAPI(docs_url="/api/docs", redoc_url="/api/redoc")


@app.get("/")
async def read_root():
    return {"Hello": "from FastAPI!"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
