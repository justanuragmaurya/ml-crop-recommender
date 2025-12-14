import os
import pandas as pd
import numpy as np
from utils import safe_read_csv, ensure_dirs

DATA_RAW = "./data/raw/Crop_recommendation.csv"
OUT_FEAT = "./data/processed/02_features.csv"
NLAGS = 14
FORECAST_WINDOW = 7

def make_lags(df, col, nlags=14):
    for lag in range(1, nlags+1):
        df[f"{col}_lag_{lag}"] = df[col].shift(lag)
    df[f"{col}_roll_mean_3"] = df[col].shift(1).rolling(window=3, min_periods=1).mean()
    df[f"{col}_roll_std_7"] = df[col].shift(1).rolling(window=7, min_periods=1).std().fillna(0)
    return df

def create_targets(df):
    df['hum_target_7d'] = df['humidity'].shift(-1).rolling(window=FORECAST_WINDOW).mean().shift(-(FORECAST_WINDOW-1))
    df['rain_target_7d'] = df['rainfall'].shift(-1).rolling(window=FORECAST_WINDOW).mean().shift(-(FORECAST_WINDOW-1))
    return df

def main():
    ensure_dirs(os.path.dirname(OUT_FEAT))
    df = safe_read_csv(DATA_RAW)
    df.columns = [c.strip().lower() for c in df.columns]
    df = make_lags(df, "humidity", NLAGS)
    df = make_lags(df, "rainfall", NLAGS)
    df = create_targets(df)
    df2 = df.dropna(subset=['hum_target_7d','rain_target_7d'])
    df2.to_csv(OUT_FEAT, index=False)
    print("Saved processed features to", OUT_FEAT)

if __name__ == "__main__":
    main()

