from services.readiness_service import calculate_readiness


def infer_decision_twin(buyer: dict, events: list) -> dict:
    inquiry_text = buyer.get("inquiry_text", "").lower()
    must_have_features = [feature.lower() for feature in buyer.get("must_have_features", [])]

    views = sum(1 for event in events if event["event_type"] == "listing_viewed")
    saves = sum(1 for event in events if event["event_type"] == "listing_saved")
    replies = sum(1 for event in events if event["event_type"] == "message_replied")

    school_keywords = ["school", "schools", "district"]
    commute_keywords = ["commute", "close commute", "freeway"]
    family_keywords = ["family", "backyard", "bedrooms"]
    modern_keywords = ["modern", "updated", "kitchen", "move-in ready"]
    value_keywords = ["budget", "value", "affordable", "price"]

    def has_keyword(keyword_list: list[str]) -> bool:
        return any(keyword in inquiry_text for keyword in keyword_list) or any(
            keyword in feature for feature in must_have_features for keyword in keyword_list
        )

    if has_keyword(school_keywords):
        primary_driver = "school quality"
        communication_angle = "schools"
    elif has_keyword(commute_keywords):
        primary_driver = "commute convenience"
        communication_angle = "commute"
    elif has_keyword(family_keywords):
        primary_driver = "family space"
        communication_angle = "family space"
    else:
        primary_driver = "overall fit"
        communication_angle = "value"

    if has_keyword(value_keywords):
        secondary_driver = "value"
        price_sensitivity = "high"
    elif buyer["budget_max"] <= 400000:
        secondary_driver = "affordability"
        price_sensitivity = "high"
    else:
        secondary_driver = "comfort"
        price_sensitivity = "medium"

    if buyer["timeline"].lower() == "asap":
        urgency = "high"
    elif "1 month" in buyer["timeline"].lower():
        urgency = "high"
    else:
        urgency = "medium"

    tour_readiness, next_best_action = calculate_readiness(events, buyer)

    confidence_score = min(0.55 + (views * 0.05) + (saves * 0.1) + (replies * 0.15), 0.98)

    return {
        "id": f"twin_{buyer['id']}",
        "buyer_id": buyer["id"],
        "primary_driver": primary_driver,
        "secondary_driver": secondary_driver,
        "price_sensitivity": price_sensitivity,
        "urgency": urgency,
        "tour_readiness": tour_readiness,
        "communication_angle": communication_angle,
        "confidence_score": round(confidence_score, 2),
        "generated_at": "2026-04-18T12:00:00Z",
        "next_best_action": next_best_action,
        "summary": (
            f"{buyer['name']} appears primarily motivated by {primary_driver}. "
            f"They show {tour_readiness} behavior with {price_sensitivity} price sensitivity. "
            f"The best message angle is {communication_angle}."
        )
    }