from fastapi import APIRouter

from app.api import auth, predictions, admin, health, user

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(user.router)      
api_router.include_router(admin.router)
api_router.include_router(predictions.router)
api_router.include_router(health.router)