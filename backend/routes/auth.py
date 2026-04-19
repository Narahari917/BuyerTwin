from fastapi import APIRouter, HTTPException, Header
from models.auth import RegisterRequest, LoginRequest
from services.auth_service import (
    create_user,
    authenticate_user,
    create_access_token,
    get_current_user_from_header,
)

router = APIRouter()


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

    token = create_access_token(user)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


@router.post("/login")
def login_user(payload: LoginRequest):
    user = authenticate_user(payload.email, payload.password)

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