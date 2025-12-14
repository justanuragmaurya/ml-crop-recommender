import os
import json
import joblib
import pandas as pd
from datetime import datetime

def ensure_dirs(path):
    os.makedirs(path, exist_ok=True)

def save_joblib(obj, path):
    ensure_dirs(os.path.dirname(path))
    joblib.dump(obj, path)

def load_joblib(path):
    return joblib.load(path)

def save_json(obj, path):
    ensure_dirs(os.path.dirname(path))
    with open(path, "w") as f:
        json.dump(obj, f, indent=2)

def timestamp():
    return datetime.utcnow().isoformat() + "Z"

def safe_read_csv(path):
    return pd.read_csv(path)

def manifest_for(model_name, features, metrics=None, out_dir="./ml-models"):
    m = {
        "model_name": model_name,
        "version": "0.1",
        "created_at": timestamp(),
        "features": features,
        "metrics": metrics or {}
    }
    save_json(m, os.path.join(out_dir, model_name + "_manifest.json"))

