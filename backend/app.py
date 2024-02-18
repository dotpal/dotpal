# main.py
from fastapi import FastAPI
import uvicorn

app = FastAPI(docs_url="/api/docs", redoc_url="/api/redoc")


@app.get("/")
def read_root():
    return {"Hello": "from FastAPI!"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
