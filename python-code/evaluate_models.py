"""
Comprehensive Model Evaluation Script
Run this to see all metrics for the DCF-SEL Crop Guidance System
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, f1_score, precision_score, recall_score,
    classification_report, confusion_matrix, mean_absolute_error,
    mean_squared_error, r2_score
)
from sklearn.model_selection import train_test_split

def print_header(title):
    print("\n" + "="*60)
    print(f" {title}")
    print("="*60)

def load_manifests():
    """Load and display all model manifests"""
    print_header("MODEL MANIFESTS (Saved Metrics)")
    
    manifest_paths = [
        "./ml-models/forecasters/hum_lgb_manifest.json",
        "./ml-models/forecasters/rain_lgb_manifest.json",
        "./ml-models/meta_learner/stacker_manifest.json"
    ]
    
    for path in manifest_paths:
        if os.path.exists(path):
            with open(path) as f:
                m = json.load(f)
            print(f"\n📊 {m['model_name'].upper()}")
            print(f"   Version: {m['version']}")
            print(f"   Created: {m['created_at']}")
            print(f"   Metrics:")
            for k, v in m['metrics'].items():
                print(f"      - {k}: {v:.6f}")

def evaluate_forecasters():
    """Evaluate the forecaster models"""
    print_header("FORECASTER EVALUATION (Humidity & Rainfall)")
    
    df = pd.read_csv("./data/processed/02_features.csv")
    
    feat_cols = []
    for c in ['humidity','rainfall']:
        feat_cols += [f"{c}_lag_{i}" for i in range(1,15)]
        feat_cols += [f"{c}_roll_mean_3", f"{c}_roll_std_7"]
    feat_cols += ['n','p','k','ph','temperature']
    df[feat_cols] = df[feat_cols].fillna(0)
    
    # Load models
    hum_model = joblib.load("./ml-models/forecasters/hum_lgb.pkl")
    rain_model = joblib.load("./ml-models/forecasters/rain_lgb.pkl")
    
    # Split data (same as training)
    split = int(0.8 * len(df))
    X_val = df.iloc[split:][feat_cols]
    y_hum_val = df.iloc[split:]['hum_target_7d']
    y_rain_val = df.iloc[split:]['rain_target_7d']
    
    # Predictions
    hum_preds = hum_model.predict(X_val)
    rain_preds = rain_model.predict(X_val)
    
    print("\n🌡️  HUMIDITY FORECASTER (7-day)")
    print(f"   MAE:  {mean_absolute_error(y_hum_val, hum_preds):.4f}")
    print(f"   RMSE: {np.sqrt(mean_squared_error(y_hum_val, hum_preds)):.4f}")
    print(f"   R²:   {r2_score(y_hum_val, hum_preds):.4f}")
    
    print("\n🌧️  RAINFALL FORECASTER (7-day)")
    print(f"   MAE:  {mean_absolute_error(y_rain_val, rain_preds):.4f}")
    print(f"   RMSE: {np.sqrt(mean_squared_error(y_rain_val, rain_preds)):.4f}")
    print(f"   R²:   {r2_score(y_rain_val, rain_preds):.4f}")

def evaluate_classifiers():
    """Evaluate the stacking classifier"""
    print_header("STACKING CLASSIFIER EVALUATION")
    
    # Load OOF predictions
    df_oof = pd.read_csv("./data/processed/oof_preds.csv")
    y = df_oof['label'].values
    X = df_oof.drop(columns=['label']).values
    
    # Load models
    stacker = joblib.load("./ml-models/meta_learner/stacker.pkl")
    le = joblib.load("./ml-models/scalers/label_encoder.pkl")
    
    # Split (same as training)
    X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Predictions
    preds = stacker.predict(X_te)
    probs = stacker.predict_proba(X_te)
    
    print("\n📈 OVERALL METRICS")
    print(f"   Accuracy:        {accuracy_score(y_te, preds):.4f}")
    print(f"   Macro F1:        {f1_score(y_te, preds, average='macro'):.4f}")
    print(f"   Weighted F1:     {f1_score(y_te, preds, average='weighted'):.4f}")
    print(f"   Macro Precision: {precision_score(y_te, preds, average='macro'):.4f}")
    print(f"   Macro Recall:    {recall_score(y_te, preds, average='macro'):.4f}")
    
    print("\n📋 CLASSIFICATION REPORT (Per-Class Metrics)")
    print(classification_report(y_te, preds, target_names=le.classes_))
    
    print("\n🔢 CONFUSION MATRIX")
    cm = confusion_matrix(y_te, preds)
    print(f"   Shape: {cm.shape[0]} classes x {cm.shape[0]} classes")
    print(f"   Diagonal sum (correct): {np.trace(cm)}")
    print(f"   Total samples: {cm.sum()}")
    print(f"   Error rate: {(cm.sum() - np.trace(cm)) / cm.sum() * 100:.2f}%")

def evaluate_base_learners():
    """Evaluate individual base learners from OOF predictions"""
    print_header("BASE LEARNER OOF PERFORMANCE")
    
    df_oof = pd.read_csv("./data/processed/oof_preds.csv")
    le = joblib.load("./ml-models/scalers/label_encoder.pkl")
    y_true = df_oof['label'].values
    n_classes = len(le.classes_)
    
    base_models = ['rf', 'xgb', 'lgb', 'knn']
    
    for i, name in enumerate(base_models):
        start = i * n_classes
        end = start + n_classes
        probs = df_oof.iloc[:, start:end].values
        preds = np.argmax(probs, axis=1)
        
        acc = accuracy_score(y_true, preds)
        f1 = f1_score(y_true, preds, average='macro')
        
        print(f"\n   {name.upper():4s} → Accuracy: {acc:.4f} | Macro F1: {f1:.4f}")

def main():
    print("\n" + "🌱"*30)
    print(" DCF-SEL CROP GUIDANCE SYSTEM - MODEL EVALUATION")
    print("🌱"*30)
    
    load_manifests()
    evaluate_forecasters()
    evaluate_base_learners()
    evaluate_classifiers()
    
    print("\n" + "="*60)
    print(" EVALUATION COMPLETE")
    print("="*60 + "\n")

if __name__ == "__main__":
    main()

