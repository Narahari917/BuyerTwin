def calculate_readiness(events: list, buyer: dict) -> tuple[str, str]:
    views = sum(1 for event in events if event["event_type"] == "listing_viewed")
    saves = sum(1 for event in events if event["event_type"] == "listing_saved")
    replies = sum(1 for event in events if event["event_type"] == "message_replied")
    clicks = sum(1 for event in events if event["event_type"] == "message_clicked")

    timeline = buyer.get("timeline", "").lower()

    if replies >= 1 or ("asap" in timeline and saves >= 1):
        return "tour ready", "schedule a tour"

    if saves >= 1 and (views >= 1 or clicks >= 1):
        return "active consideration", "send top 3 listings"

    if views >= 1 and saves == 0:
        return "research mode", "wait and nurture"

    return "follow-up needed", "follow up on saved homes"