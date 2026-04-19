from fastapi import APIRouter, HTTPException, Header
from services.inference_service import infer_decision_twin
from services.recommendation_service import generate_recommendations
from services.outreach_service import generate_outreach
from services.buyer_service import get_all_buyers, get_buyer_by_id
from services.event_service import get_events_by_buyer_id
from services.listing_service import get_all_listings
from services.auth_service import get_current_user_from_header, require_role

router = APIRouter()


@router.get("/inbox")
def get_buyer_inbox(authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyers = get_all_buyers()
    listings = get_all_listings()

    inbox_items = []

    for buyer in buyers:
        buyer_events = get_events_by_buyer_id(buyer["id"])
        twin = infer_decision_twin(buyer, buyer_events)
        recommendations = generate_recommendations(buyer, twin, listings)
        top_recommendation = recommendations[0] if recommendations else None

        inbox_items.append({
            "buyer_id": buyer["id"],
            "buyer_name": buyer["name"],
            "readiness": twin["tour_readiness"],
            "urgency": twin["urgency"],
            "primary_driver": twin["primary_driver"],
            "top_recommendation_address": top_recommendation["address_label"] if top_recommendation else None,
            "top_fit_score": top_recommendation["fit_score"] if top_recommendation else None,
            "next_best_action": twin["next_best_action"]
        })

    urgency_order = {"high": 0, "medium": 1, "low": 2}
    readiness_order = {
        "tour ready": 0,
        "active consideration": 1,
        "research mode": 2,
        "follow-up needed": 3
    }

    inbox_items.sort(
        key=lambda item: (
            urgency_order.get(item["urgency"], 99),
            readiness_order.get(item["readiness"], 99),
            -item["top_fit_score"] if item["top_fit_score"] is not None else 999
        )
    )

    return {
        "status": "success",
        "count": len(inbox_items),
        "buyers": inbox_items
    }


@router.get("/")
def get_buyers(authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])
    return get_all_buyers()


@router.get("/{buyer_id}")
def get_buyer_by_id_route(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer


@router.get("/{buyer_id}/events")
def get_buyer_events(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return get_events_by_buyer_id(buyer_id)


@router.get("/{buyer_id}/dashboard")
def get_buyer_dashboard(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    buyer_events = get_events_by_buyer_id(buyer_id)
    twin = infer_decision_twin(buyer, buyer_events)

    listings = get_all_listings()
    recommendations = generate_recommendations(buyer, twin, listings)

    outreach = generate_outreach(buyer, twin, recommendations[0]) if recommendations else None
    top_recommendation = recommendations[0] if recommendations else None

    summary = {
        "buyer_name": buyer["name"],
        "readiness": twin["tour_readiness"],
        "primary_driver": twin["primary_driver"],
        "top_listing_id": top_recommendation["listing_id"] if top_recommendation else None,
        "top_listing_address": top_recommendation["address_label"] if top_recommendation else None,
        "top_fit_score": top_recommendation["fit_score"] if top_recommendation else None,
        "next_best_action": twin["next_best_action"]
    }

    return {
        "status": "success",
        "summary": summary,
        "buyer": buyer,
        "events": buyer_events,
        "twin": twin,
        "recommendations": recommendations,
        "outreach": outreach
    }