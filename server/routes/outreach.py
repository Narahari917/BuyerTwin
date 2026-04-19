from fastapi import APIRouter, HTTPException
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations
from services.outreach_service import generate_outreach
from services.buyer_service import get_buyer_by_id
from services.event_service import get_events_by_buyer_id
from services.listing_service import get_all_listings

router = APIRouter()


@router.post("/{buyer_id}")
def create_outreach(buyer_id: str):
    buyer = get_buyer_by_id(buyer_id)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    buyer_events = get_events_by_buyer_id(buyer_id)
    twin = infer_decision_twin(buyer, buyer_events)
    listings = get_all_listings()
    recommendations = generate_recommendations(buyer, twin, listings)

    if not recommendations:
        raise HTTPException(status_code=404, detail="No recommendations available")

    top_recommendation = recommendations[0]
    return generate_outreach(buyer, twin, top_recommendation)