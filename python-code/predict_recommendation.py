import joblib
import pandas as pd
import numpy as np

def load_models():
    le = joblib.load("./ml-models/scalers/label_encoder.pkl")
    feature_list = joblib.load("./ml-models/feature_list.pkl")
    stacker = joblib.load("./ml-models/meta_learner/stacker.pkl")
    base_models = {
        "rf": joblib.load("./ml-models/base_classifiers/rf_full.pkl"),
        "xgb": joblib.load("./ml-models/base_classifiers/xgb_full.pkl"),
        "lgb": joblib.load("./ml-models/base_classifiers/lgb_full.pkl"),
        "knn": joblib.load("./ml-models/base_classifiers/knn_full.pkl")
    }
    return le, feature_list, base_models, stacker

def preprocess_input(sample_df, feature_list):
    sample_df = sample_df.reindex(columns=feature_list, fill_value=0)
    return sample_df

def predict_crop(sample):
    le, feature_list, base_models, stacker = load_models()
    X = preprocess_input(pd.DataFrame([sample]), feature_list)
    base_probs = []
    for name, model in base_models.items():
        base_probs.append(model.predict_proba(X))
    X_meta = np.hstack(base_probs)
    final_probs = stacker.predict_proba(X_meta)[0]
    top_idx = final_probs.argsort()[::-1][:3]
    crops = le.inverse_transform(top_idx)
    scores = final_probs[top_idx]
    return list(zip(crops, scores))

