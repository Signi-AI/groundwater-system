import random
import string
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.core.email import send_otp_email
from app.repositories import user_repository
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest


def _generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def _get_expiry(minutes: int = 10) -> datetime:
    return datetime.now(timezone.utc) + timedelta(minutes=minutes)


def _otp_still_valid(user) -> bool:
    if not user or not user.reset_token or not user.reset_token_expires:
        return False
    exp = user.reset_token_expires
    if exp.tzinfo is None:
        exp = exp.replace(tzinfo=timezone.utc)
    return exp >= datetime.now(timezone.utc)


def register(db: Session, payload: UserCreate):
    email = payload.email.lower().strip()
    if user_repository.get_by_email(db, email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email is already registered",
        )

    return user_repository.create(
        db,
        email=email,
        full_name=payload.full_name.strip(),
        hashed_password=hash_password(payload.password),
    )


def login(db: Session, payload: LoginRequest) -> str:
    user = user_repository.get_by_email(db, payload.email.lower().strip())
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return create_access_token(str(user.id))


def send_otp(db: Session, email: str) -> dict:
    """
    Generate 6-digit OTP, save on user, send to that user's email.
    Always same public message (security).
    """
    public_msg = {
        "message": "If that email is registered, a 6-digit OTP has been sent.",
    }

    user = user_repository.get_by_email(db, email.lower().strip())
    if not user:
        return public_msg

    otp = _generate_otp()
    user_repository.set_reset_token(db, user, otp, _get_expiry(10))

    sent = send_otp_email(user.email, otp)
    if not sent:
        public_msg["hint"] = "Email not sent — check MAIL settings or terminal DEBUG_OTP."

    return public_msg


def verify_otp(db: Session, email: str, otp: str) -> dict:
    """Check OTP only — does not change password."""
    user = user_repository.get_by_email(db, email.lower())

    if not user or not _otp_still_valid(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    if user.reset_token != otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    return {
        "message": "OTP verified successfully",
        "email": user.email,
        "valid": True,
    }


def reset_password_with_otp(
    db: Session,
    email: str,
    otp: str,
    new_password: str,
) -> dict:
    """Verify OTP again and set new password."""
    user = user_repository.get_by_email(db, email.lower())

    if not user or not _otp_still_valid(user):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    if user.reset_token != otp.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP",
        )

    user_repository.update_password(db, user, hash_password(new_password))
    return {"message": "Password updated successfully"}