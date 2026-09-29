"""Create or update super_admin on the DB in DATABASE_URL."""
import os

from app.core.database import SessionLocal
from app.models.user import User

# password hash — match your project
try:
    from app.core.security import get_password_hash as hash_password
except ImportError:
    from app.core.security import hash_password

EMAIL = "admin@groundwater.com"
NAME = "Super Admin"

def main():
    password = os.environ.get("ADMIN_PASSWORD")
    if not password:
        raise RuntimeError("Set ADMIN_PASSWORD before running this script")

    db = SessionLocal()
    try:
        u = db.query(User).filter(User.email == EMAIL).first()
        if u:
            u.role = "super_admin"
            u.hashed_password = hash_password(password)
            if hasattr(u, "is_active"):
                u.is_active = True
            print("UPDATED:", EMAIL, "→ super_admin")
        else:
            data = {
                "email": EMAIL,
                "role": "super_admin",
                "hashed_password": hash_password(password),
            }
            # optional fields if model has them
            if hasattr(User, "name"):
                data["name"] = NAME
            if hasattr(User, "full_name"):
                data["full_name"] = NAME
            if hasattr(User, "is_active"):
                data["is_active"] = True
            u = User(**data)
            db.add(u)
            print("CREATED:", EMAIL, "role=super_admin")
        db.commit()
    finally:
        db.close()

if __name__ == "__main__":
    main()