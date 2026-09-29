import joblib

path = "backend/ml/models/geological_prediction_model.pkl"

bundle = joblib.load(path)

depth_model = bundle["depth_model"]

print("Depth model loaded successfully")
print("Features:")
print(list(depth_model.feature_names_in_))

print("\nExpected feature count:")
print(depth_model.n_features_in_)