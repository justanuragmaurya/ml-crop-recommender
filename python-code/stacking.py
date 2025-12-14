import os
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, f1_score
import xgboost as xgb
from utils import save_joblib, manifest_for, ensure_dirs

OOF_PATH = "./data/processed/oof_preds.csv"
STACKER_OUT = "./ml-models/meta_learner/stacker.pkl"
MANIFEST_DIR = "./ml-models/meta_learner"

def main():
    ensure_dirs(os.path.dirname(STACKER_OUT))
    df = pd.read_csv(OOF_PATH)
    y = df['label'].values
    X = df.drop(columns=['label']).values
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2,
                                              random_state=42, stratify=y)
    params = {
        "objective": "multi:softprob",
        "num_class": len(np.unique(y)),
        "learning_rate": 0.05,
        "max_depth": 4,
        "n_estimators": 300,
        "early_stopping_rounds": 30
    }
    model = xgb.XGBClassifier(**params)
    model.fit(X_tr, y_tr, eval_set=[(X_te, y_te)], verbose=False)
    preds = model.predict(X_te)
    acc = accuracy_score(y_te, preds)
    f1 = f1_score(y_te, preds, average='macro')
    print("Stacker → Accuracy:", acc, "Macro F1:", f1)
    save_joblib(model, STACKER_OUT)
    manifest_for("stacker", [], metrics={"accuracy": acc, "macro_f1": f1},
                 out_dir=MANIFEST_DIR)

if __name__ == "__main__":
    main()

