import os

from app.core.database import SessionLocal
from app.models.user import User

try:
    from app.core.security import get_password_hash as hash_password
except ImportError:
    from app.core.security import hash_password

EMAIL = "admin@groundwater.com"

db = SessionLocal()
u = db.query(User).filter(User.email == EMAIL).first()
if not u:
    print("NOT FOUND")
else:
    password = os.environ.get("ADMIN_PASSWORD")
    if not password:
        raise RuntimeError("Set ADMIN_PASSWORD before running this script")
    print("before:", u.email, u.role)
    u.role = "super_admin"
    pwd = hash_password(password)
    if hasattr(u, "hashed_password"):
        u.hashed_password = pwd
    elif hasattr(u, "password_hash"):
        u.password_hash = pwd
    if hasattr(u, "is_active"):
        u.is_active = True
    db.commit()
    print("after:", u.email, "super_admin + password reset to SignAI")
db.close()