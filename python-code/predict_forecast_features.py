import os
import joblib
import pandas as pd
import numpy as np
from utils import safe_read_csv, ensure_dirs

IN_FEAT = "./data/processed/02_features.csv"
OUT_PATH = "./data/processed/03_with_forecasts.csv"
MODEL_DIR = "./ml-models/forecasters"

def compute_pest_risk(temp, hum_fc, rain_fc):
    hum_score = hum_fc / 100
    rain_score = min(1.0, rain_fc / 50)
    temp_score = 1 if (20 <= temp <= 30) else 0
    return float(np.clip(0.5*hum_score + 0.3*rain_score + 0.2*temp_score, 0, 1))

def main():
    ensure_dirs(os.path.dirname(OUT_PATH))
    df = safe_read_csv(IN_FEAT)
    hum_model = joblib.load(f"{MODEL_DIR}/hum_lgb.pkl")
    rain_model = joblib.load(f"{MODEL_DIR}/rain_lgb.pkl")
    feat_cols = []
    for c in ['humidity','rainfall']:
        feat_cols += [f"{c}_lag_{i}" for i in range(1,15)]
        feat_cols += [f"{c}_roll_mean_3", f"{c}_roll_std_7"]
    feat_cols += ['n','p','k','ph','temperature']
    df[feat_cols] = df[feat_cols].fillna(0)
    df['hum_fc_7'] = hum_model.predict(df[feat_cols])
    df['rain_fc_7'] = rain_model.predict(df[feat_cols])
    df['pest_risk_index'] = df.apply(lambda r: compute_pest_risk(r['temperature'], r['hum_fc_7'], r['rain_fc_7']), axis=1)
    df.to_csv(OUT_PATH, index=False)
    print("Saved forecast-enhanced dataset to", OUT_PATH)

if __name__ == "__main__":
    main()

