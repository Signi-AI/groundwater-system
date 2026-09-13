from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.deps import get_current_super_admin
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserResponse
from app.schemas.auth import AdminResetPasswordRequest
from app.repositories import user_repository

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/me", response_model=UserResponse)
def admin_me(admin: User = Depends(get_current_super_admin)):
    return admin


@router.post("/users/{user_id}/reset-password")
def admin_reset_password(
    user_id: int,
    payload: AdminResetPasswordRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_super_admin),
):
    user = user_repository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    user_repository.update_password(db, user, hash_password(payload.new_password))
    return {"message": f"Password reset for {user.email}"}