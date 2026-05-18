import logging

from fastapi import APIRouter, HTTPException, Header
from models.auth import RegisterRequest, LoginRequest
from services.auth_service import (
    create_user,
    authenticate_user,
    create_access_token,
    get_current_user_from_header,
)

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/register")
def register_user(payload: RegisterRequest):
    try:
        user = create_user(
            name=payload.name,
            email=payload.email,
            password=payload.password,
            role=payload.role,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception:
        logger.exception("Unexpected error during registration for email=%s", payload.email)
        raise HTTPException(status_code=500, detail="Registration failed")

    token = create_access_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.post("/login")
def login_user(payload: LoginRequest):
    try:
        user = authenticate_user(payload.email, payload.password)
    except Exception:
        logger.exception("Unexpected error during login for email=%s", payload.email)
        raise HTTPException(status_code=500, detail="Login failed")

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.get("/me")
def get_current_user(authorization: str = Header(default=None)):
    user = get_current_user_from_header(authorization)
    return {
        "status": "success",
        "user": user,
    }