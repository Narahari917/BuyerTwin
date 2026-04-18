from fastapi import APIRouter, HTTPException
from services.loader_service import load_json
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations
from services.outreach_service import generate_outreach

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


@router.get("/{buyer_id}/dashboard")
def get_buyer_dashboard(buyer_id: str):
    buyers = load_json("buyers.json")
    buyer = next((buyer for buyer in buyers if buyer["id"] == buyer_id), None)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    events = load_json("events.json")
    buyer_events = [event for event in events if event["buyer_id"] == buyer_id]
    buyer_events.sort(key=lambda event: event["timestamp"])

    twin = infer_decision_twin(buyer, buyer_events)

    listings = load_json("listings.json")
    recommendations = generate_recommendations(buyer, twin, listings)

    outreach = generate_outreach(buyer, twin, recommendations[0]) if recommendations else None

    return {
        "buyer": buyer,
        "events": buyer_events,
        "twin": twin,
        "recommendations": recommendations,
        "outreach": outreach
    }