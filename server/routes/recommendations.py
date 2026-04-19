from fastapi import APIRouter, HTTPException
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations
from services.buyer_service import get_buyer_by_id
from services.event_service import get_events_by_buyer_id
from services.listing_service import get_all_listings

router = APIRouter()


@router.get("/{buyer_id}")
def get_recommendations(buyer_id: str):
    buyer = get_buyer_by_id(buyer_id)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    buyer_events = get_events_by_buyer_id(buyer_id)
    twin = infer_decision_twin(buyer, buyer_events)
    listings = get_all_listings()

    return generate_recommendations(buyer, twin, listings)