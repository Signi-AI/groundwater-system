from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.prediction import PredictionCreate
from app.services import ml_service 
from app.repositories import prediction_repository
from app.services.ml_service import run_prediction


def create_prediction(db, user, body: PredictionCreate):
    payload = body.model_dump() if hasattr(body, "model_dump") else body.dict()
    ml_result = run_prediction(payload)

    # Merge input + ml for DB row (adjust field names to your SQLAlchemy model)
    record_data = {
        **payload,
        **ml_result,
    }
    # example:
    # pred = Prediction(**{k: record_data.get(k) for k in allowed_columns}, user_id=user.id)
    # db.add(pred); db.commit(); db.refresh(pred)
    # return pred mapped to PredictionOut

    return {**ml_result, "latitude": body.latitude, "longitude": body.longitude, "region": body.region}


def list_predictions(db: Session, user: User, skip: int = 0, limit: int = 50):
    return prediction_repository.list_by_user(db, user.id, skip=skip, limit=limit)


def get_prediction(db: Session, user: User, prediction_id: int):
    row = prediction_repository.get_by_id(db, prediction_id)
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Prediction not found")
    if row.user_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    return row