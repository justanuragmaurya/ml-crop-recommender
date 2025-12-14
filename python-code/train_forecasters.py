import os
import joblib
import lightgbm as lgb
import numpy as np
import pandas as pd
from sklearn.metrics import mean_absolute_error, mean_squared_error
from utils import save_joblib, manifest_for, safe_read_csv, ensure_dirs

IN_FEAT = "./data/processed/02_features.csv"
MODEL_DIR = "./ml-models/forecasters"
SEED = 42

def train_target(df, target_col, feat_cols, model_name):
    split = int(0.8 * len(df))
    X_train, y_train = df.iloc[:split][feat_cols], df.iloc[:split][target_col]
    X_val, y_val = df.iloc[split:][feat_cols], df.iloc[split:][target_col]
    train_set = lgb.Dataset(X_train, label=y_train)
    valid_set = lgb.Dataset(X_val, label=y_val)
    params = {
        'objective':'regression',
        'metric':'rmse',
        'learning_rate':0.05,
        'num_leaves':31,
        'seed': SEED,
        'verbosity': -1
    }
    model = lgb.train(
        params, train_set,
        num_boost_round=500,
        valid_sets=[train_set, valid_set],
        callbacks=[
            lgb.early_stopping(stopping_rounds=30),
            lgb.log_evaluation(period=50)
        ]
    )
    preds = model.predict(X_val)
    mae = mean_absolute_error(y_val, preds)
    rmse = np.sqrt(mean_squared_error(y_val, preds))
    ensure_dirs(MODEL_DIR)
    joblib.dump(model, f"{MODEL_DIR}/{model_name}.pkl")
    manifest_for(model_name, feat_cols, metrics={'mae': mae, 'rmse': rmse}, out_dir=MODEL_DIR)
    print(f"{model_name} -> MAE={mae}, RMSE={rmse}")

def main():
    df = safe_read_csv(IN_FEAT)
    feat_cols = []
    for c in ['humidity','rainfall']:
        feat_cols += [f"{c}_lag_{i}" for i in range(1,15)]
        feat_cols += [f"{c}_roll_mean_3", f"{c}_roll_std_7"]
    feat_cols += ['n','p','k','ph','temperature']
    df[feat_cols] = df[feat_cols].fillna(0)
    train_target(df, 'hum_target_7d', feat_cols, 'hum_lgb')
    train_target(df, 'rain_target_7d', feat_cols, 'rain_lgb')

if __name__ == "__main__":
    main()

