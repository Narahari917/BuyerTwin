from fastapi import APIRouter, HTTPException, Header
from services.inference_service import infer_decision_twin
from services.buyer_service import get_buyer_by_id
from services.event_service import get_events_by_buyer_id
from services.auth_service import get_current_user_from_header, require_role

router = APIRouter()


@router.get("/{buyer_id}")
def get_twin(buyer_id: str, authorization: str = Header(default=None)):
    current_user = get_current_user_from_header(authorization)
    require_role(current_user, ["agent"])

    buyer = get_buyer_by_id(buyer_id)

    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")

    buyer_events = get_events_by_buyer_id(buyer_id)
    twin = infer_decision_twin(buyer, buyer_events)
    return twin