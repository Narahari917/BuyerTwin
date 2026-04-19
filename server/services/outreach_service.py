def build_angle_phrase(angle: str) -> str:
    angle = angle.lower()

    if angle == "schools":
        return "the school district match"
    if angle == "commute":
        return "the commute convenience"
    if angle == "family space":
        return "the family space"
    if angle == "value":
        return "the overall value"
    return "the overall fit"


def build_buyer_friendly_action(next_action: str) -> str:
    action = next_action.lower()

    if action == "send top 3 listings":
        return "share a few strong options"
    if action == "schedule a tour":
        return "schedule a tour"
    if action == "wait and nurture":
        return "keep an eye on similar homes"
    if action == "follow up on saved homes":
        return "revisit the homes you liked most"
    return next_action


def generate_outreach(buyer: dict, twin: dict, top_recommendation: dict) -> dict:
    buyer_name = buyer["name"]
    address = top_recommendation["address_label"]
    city = top_recommendation["city"]
    price = top_recommendation["price"]
    fit_score = top_recommendation["fit_score"]
    angle_phrase = build_angle_phrase(twin["communication_angle"])
    readiness = twin["tour_readiness"]
    buyer_friendly_action = build_buyer_friendly_action(twin["next_best_action"])

    sms_text = (
        f"Hi {buyer_name}, I found a home that seems like a great match for you — "
        f"{address} in {city}. It stands out because of {angle_phrase}. "
        f"Would you like me to send more details or share a few similar options?"
    )

    email_subject = f"A strong home match for you: {address}"

    email_body = (
        f"Hi {buyer_name},\n\n"
        f"I wanted to share a home that looks like a particularly strong fit for what you’ve been looking for.\n\n"
        f"Property: {address}, {city}\n"
        f"Price: ${price:,}\n"
        f"Fit Score: {fit_score}\n\n"
        f"This home stands out because of {angle_phrase}, and your recent activity suggests you are in {readiness}.\n\n"
        f"A good next step would be to {buyer_friendly_action}. "
        f"I can also send you a few similar homes if you'd like.\n\n"
        f"Best,\n"
        f"Your Agent"
    )

    call_script = (
        f"Hi {buyer_name}, this is your agent. I wanted to quickly share a home that seems like a strong fit: "
        f"{address} in {city}, listed at ${price:,}. "
        f"What stands out most is {angle_phrase}. "
        f"Based on your recent activity, a good next step would be to {buyer_friendly_action}. "
        f"Would you like me to send the details or help set up a tour?"
    )

    return {
        "id": f"outreach_{buyer['id']}_{top_recommendation['listing_id']}",
        "buyer_id": buyer["id"],
        "listing_id": top_recommendation["listing_id"],
        "sms_text": sms_text,
        "email_subject": email_subject,
        "email_body": email_body,
        "call_script": call_script,
        "generated_at": "2026-04-18T12:30:00Z"
    }