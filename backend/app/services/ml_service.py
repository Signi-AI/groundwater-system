from ml.predict_quality import predict_water_quality
from ml.predict_geology import predict_geology, geology_available

def run_prediction(payload: dict) -> dict:
    """
    payload keys from API body
    """
    quality = predict_water_quality(
        nitrate=payload.get("nitrate") or 10,
        fluoride=payload.get("fluoride") or 1.0,
        calcium=payload.get("calcium") or 50,
        magnesium=payload.get("magnesium") or 20,
        hco3=payload.get("hco3") or 100,
        tds=payload.get("tds") or 500,
        turbidity=payload.get("turbidity") or 5,
        region=payload.get("region") or "DODOMA-ZONE",
    )

    geo = {"geology_available": False}
    if geology_available() and payload.get("depth_input"):
        geo = predict_geology(
            depth_input=payload.get("depth_input"),
            sensor_rows=payload.get("sensor_rows"),
        )
    elif geology_available():
        geo = predict_geology()

    # Combine for frontend card
    depth = geo.get("expected_depth") or geo.get("depth")
    if depth is None:
        depth = "—"

    formation = geo.get("formation") or geo.get("rock_type") or "—"

    # Simple potential heuristic from quality
    ph = quality["ph"]
    hard = quality["total_hardness"]
    if 6.5 <= ph <= 8.5 and hard < 300:
        potential = "HIGH"
        conf = 82
    elif 6.0 <= ph <= 9.0:
        potential = "MEDIUM"
        conf = 70
    else:
        potential = "LOW"
        conf = 60

    return {
        "water_potential": potential,
        "potential": potential,
        "depth": depth,
        "expected_depth": depth,
        "formation": formation,
        "rock_type": formation,
        "aquifer_potential": potential,
        "expected_yield": "MEDIUM–HIGH" if potential != "LOW" else "LOW",
        "water_quality": quality["water_quality"],
        "ph": quality["ph"],
        "salinity": quality["salinity"],
        "total_hardness": quality["total_hardness"],
        "conductivity": quality["conductivity"],
        "ph_category": quality["ph_category"],
        "confidence": conf,
        "recommendation": quality["recommendation"],
        "geology_available": geo.get("geology_available", False),
    }