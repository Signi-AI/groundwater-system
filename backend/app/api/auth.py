from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    SendOtpRequest,
    VerifyOtpRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=201)
def register(payload: UserCreate, db: Session = Depends(get_db)):
    return auth_service.register(db, payload)


@router.post("/login/form", response_model=TokenResponse)
def login_form(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    token = auth_service.login(
        db,
        LoginRequest(email=form.username, password=form.password),
    )
    return TokenResponse(access_token=token)


@router.post("/send-otp")
def send_otp(payload: SendOtpRequest, db: Session = Depends(get_db)):
    """1) Generate OTP and send to registered user's email."""
    return auth_service.send_otp(db, payload.email)


@router.post("/verify-otp")
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)):
    """2) Verify OTP code from email."""
    return auth_service.verify_otp(db, payload.email, payload.otp)


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """3) Set new password using email + valid OTP."""
    return auth_service.reset_password_with_otp(
        db,
        email=payload.email,
        otp=payload.otp,
        new_password=payload.new_password,
    )


@router.post("/forgot-password")
def forgot_password(payload: SendOtpRequest, db: Session = Depends(get_db)):
    """Alias of send-otp (same behaviour)."""
    return auth_service.send_otp(db, payload.email)


@router.post("/change-password")
def change_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return auth_service.change_password(
        db, user, payload.current_password, payload.new_password
    )