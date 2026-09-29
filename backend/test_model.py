import joblib

path = "backend/ml/models/geological_prediction_model.pkl"

model_bundle = joblib.load(path)

print("TYPE:", type(model_bundle))

if isinstance(model_bundle, dict):
    print("KEYS:", model_bundle.keys())

    for key, value in model_bundle.items():
        print("\n---", key, "---")
        print("TYPE:", type(value))

        if hasattr(value, "feature_names_in_"):
            print("FEATURES:", list(value.feature_names_in_))

        if hasattr(value, "n_features_in_"):
            print("NUMBER OF FEATURES:", value.n_features_in_)

else:
    print("FEATURES:", getattr(model_bundle, "feature_names_in_", None))
    print("NUMBER OF FEATURES:", getattr(model_bundle, "n_features_in_", None))