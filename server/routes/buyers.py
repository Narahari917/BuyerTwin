from fastapi import APIRouter, HTTPException
from services.loader_service import load_json

router = APIRouter()


@router.get("/")
def get_buyers():
    return load_json("buyers.json")


@router.get("/{buyer_id}")
def get_buyer_by_id(buyer_id: str):
    buyers = load_json("buyers.json")
    for buyer in buyers:
        if buyer["id"] == buyer_id:
            return buyer
    raise HTTPException(status_code=404, detail="Buyer not found")


@router.get("/{buyer_id}/events")
def get_buyer_events(buyer_id: str):
    buyers = load_json("buyers.json")
    buyer_exists = any(buyer["id"] == buyer_id for buyer in buyers)

    if not buyer_exists:
        raise HTTPException(status_code=404, detail="Buyer not found")

    events = load_json("events.json")
    buyer_events = [event for event in events if event["buyer_id"] == buyer_id]

    buyer_events.sort(key=lambda event: event["timestamp"])
    return buyer_events