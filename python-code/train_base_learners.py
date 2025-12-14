import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
import xgboost as xgb
import lightgbm as lgb
from utils import ensure_dirs, save_joblib

IN_PATH = "./data/processed/03_with_forecasts.csv"
OUT_MODELS_DIR = "./ml-models/base_classifiers"
OOF_PATH = "./data/processed/oof_preds.csv"
SEED = 42
N_SPLITS = 5

def feature_matrix(df):
    base = ['n','p','k','ph','temperature',
            'humidity','rainfall',
            'hum_fc_7','rain_fc_7','pest_risk_index']
    lag_feats = [c for c in df.columns if ("_lag_" in c)]
    roll_feats = [c for c in df.columns if ("roll_" in c)]
    return df[base + lag_feats + roll_feats]

def main():
    ensure_dirs(os.path.dirname(OOF_PATH))
    ensure_dirs(OUT_MODELS_DIR)
    df = pd.read_csv(IN_PATH)
    X = feature_matrix(df).fillna(0)
    y = df['label'].astype(str)
    le = LabelEncoder()
    y_enc = le.fit_transform(y)
    save_joblib(le, "./ml-models/scalers/label_encoder.pkl")
    models = {
        "rf": RandomForestClassifier(n_estimators=200, random_state=SEED),
        "xgb": xgb.XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', n_estimators=200),
        "lgb": lgb.LGBMClassifier(n_estimators=200, verbosity=-1),
        "knn": KNeighborsClassifier(n_neighbors=7)
    }
    n_classes = len(np.unique(y_enc))
    oof = np.zeros((len(X), len(models) * n_classes))
    skf = StratifiedKFold(n_splits=N_SPLITS, shuffle=True, random_state=SEED)
    m_idx = 0
    for name, model in models.items():
        fold_oof = np.zeros((len(X), n_classes))
        fold_id = 0
        for tr, va in skf.split(X, y_enc):
            model.fit(X.iloc[tr], y_enc[tr])
            joblib.dump(model, f"{OUT_MODELS_DIR}/{name}_fold{fold_id}.pkl")
            fold_oof[va] = model.predict_proba(X.iloc[va])
            fold_id += 1
        model.fit(X, y_enc)
        joblib.dump(model, f"{OUT_MODELS_DIR}/{name}_full.pkl")
        start = m_idx * n_classes
        end = start + n_classes
        oof[:, start:end] = fold_oof
        m_idx += 1
    cols = []
    for name in models:
        for c in le.classes_:
            cols.append(f"{name}__prob__{c}")
    df_oof = pd.DataFrame(oof, columns=cols)
    df_oof['label'] = y_enc
    df_oof.to_csv(OOF_PATH, index=False)
    save_joblib(list(X.columns), "./ml-models/feature_list.pkl")
    print("Saved OOF predictions to", OOF_PATH)

if __name__ == "__main__":
    main()

