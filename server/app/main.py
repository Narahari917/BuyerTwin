from fastapi import FastAPI
from routes.buyers import router as buyers_router
from routes.twins import router as twins_router

app = FastAPI(
    title="BuyerTwin AI Backend",
    description="Backend API for BuyerTwin AI hackathon MVP",
    version="0.1.0",
)

app.include_router(buyers_router, prefix="/buyers", tags=["buyers"])
app.include_router(twins_router, prefix="/twins", tags=["twins"])


@app.get("/")
def root():
    return {"message": "BuyerTwin AI backend is running"}