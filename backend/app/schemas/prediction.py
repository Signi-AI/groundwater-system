from pydantic import BaseModel, Field
from typing import Optional, Any, List

class PredictionCreate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region: Optional[str] = None

    # Water quality features
    nitrate: Optional[float] = 10
    fluoride: Optional[float] = 1.0
    calcium: Optional[float] = 50
    magnesium: Optional[float] = 20
    hco3: Optional[float] = 100
    tds: Optional[float] = 500
    turbidity: Optional[float] = 5

    # Optional geology (advanced)
    depth_input: Optional[dict] = None
    sensor_rows: Optional[List[dict]] = None

    resistivity: Optional[float] = None
    elevation: Optional[float] = None
    rainfall: Optional[float] = None
    rock_type: Optional[str] = None

class PredictionOut(BaseModel):
    id: Optional[int] = None
    water_potential: Optional[str] = None
    potential: Optional[str] = None
    depth: Optional[Any] = None
    expected_depth: Optional[Any] = None
    formation: Optional[str] = None
    rock_type: Optional[str] = None
    aquifer_potential: Optional[str] = None
    expected_yield: Optional[str] = None
    water_quality: Optional[str] = None
    ph: Optional[float] = None
    salinity: Optional[str] = None
    total_hardness: Optional[float] = None
    conductivity: Optional[float] = None
    ph_category: Optional[str] = None
    confidence: Optional[float] = None
    recommendation: Optional[str] = None
    geology_available: Optional[bool] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    region: Optional[str] = None

    class Config:
        from_attributes = True
PredictionResponse = PredictionOut