from fastapi import FastAPI
import uvicorn
from .schemas import User
from datetime import datetime

app = FastAPI(docs_url="/api/docs", redoc_url="/api/redoc")


user_1_data = {
    "username": "user_1",
    "email": "user1@user.email",
    "original_id": "npm-rendezvous",
    "coordinate": {"lat": 35.6895, "lon": 139.691},
    "created_at": datetime.now(),
}

user_2_data = {
    "username": "user_2",
    "email": "ericCartman@eric.us",
    "original_id": "fatAss752",
    "coordinate": {"lat": 35.6895, "lon": 139.695},
    "created_at": datetime.now(),
}

user_3_data = {
    "username": "user_3",
    "email": "cto@gmail.com",
    "original_id": "Chris Chang",
    "coordinate": {"lat": 35.6895, "lon": 139.6918},
    "created_at": datetime.now(),
}

user_1, user_2, user_3 = User(**user_1_data), User(**user_2_data), User(**user_3_data)


@app.get("/users", response_model=list[User])
async def read_users():
    return [user_1, user_2, user_3]


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
