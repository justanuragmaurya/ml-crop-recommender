# 📚 DCF-SEL Crop Guidance System - Viva Preparation Notes

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Dataset Description](#3-dataset-description)
4. [System Architecture](#4-system-architecture)
5. [Data Preprocessing & Feature Engineering](#5-data-preprocessing--feature-engineering)
6. [Model Training Pipeline](#6-model-training-pipeline)
7. [Stacking Ensemble Learning](#7-stacking-ensemble-learning)
8. [Evaluation Metrics](#8-evaluation-metrics)
9. [Inference Pipeline](#9-inference-pipeline)
10. [Key Concepts to Understand](#10-key-concepts-to-understand)


---

## 1. Project Overview

### What is DCF-SEL?
**DCF-SEL** stands for **Dynamic Crop Forecast + Stacked Ensemble Learning**.

This is a machine learning system that:
- **Forecasts** future weather conditions (humidity, rainfall) using time-series features
- **Recommends crops** based on soil parameters, current weather, and forecasted conditions
- Uses **stacked ensemble learning** to combine multiple ML models for higher accuracy

### Why This Approach?
Traditional crop recommendation systems only consider current conditions. Our system is **dynamic** because it:
1. Predicts future weather (7-day forecasts)
2. Calculates pest risk based on forecasted conditions
3. Combines multiple models to reduce prediction errors

---

## 2. Problem Statement

**Goal:** Given soil nutrients (N, P, K), soil pH, temperature, humidity, and rainfall, recommend the most suitable crop to grow.

**Challenges:**
- Weather conditions change over time
- Single ML models may have biases
- Need high accuracy for agricultural decisions (wrong crop = financial loss)

**Solution:**
- Use LightGBM forecasters for weather prediction
- Use stacked ensemble (4 base models + 1 meta-learner) for robust classification
- Achieve 99%+ accuracy through model combination

---

## 3. Dataset Description

### Source
`Crop_recommendation.csv` - Contains 2200 samples across 22 crop types

### Features (Input Variables)

| Feature | Description | Range |
|---------|-------------|-------|
| **N** | Nitrogen content in soil (kg/ha) | 0-140 |
| **P** | Phosphorus content in soil (kg/ha) | 5-145 |
| **K** | Potassium content in soil (kg/ha) | 5-205 |
| **temperature** | Temperature in Celsius | 8-44°C |
| **humidity** | Relative humidity (%) | 14-100% |
| **ph** | Soil pH level | 3.5-10 |
| **rainfall** | Annual rainfall (mm) | 20-300mm |

### Target Variable
**label** - Crop name (22 classes):
- Rice, Wheat, Maize, Chickpea, Kidney Beans, Pigeon Peas, Moth Beans, Mung Bean, Black Gram, Lentil
- Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee

### Class Distribution
- Each crop has **100 samples** (balanced dataset)
- Total: 2200 samples

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DCF-SEL ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RAW DATA                                                       │
│     │                                                           │
│     ▼                                                           │
│  ┌──────────────────┐                                          │
│  │   PREPROCESSING  │  → Lag features, Rolling stats           │
│  └────────┬─────────┘                                          │
│           │                                                     │
│           ▼                                                     │
│  ┌──────────────────┐      ┌──────────────────┐               │
│  │ HUMIDITY FORECAST│      │ RAINFALL FORECAST│  (LightGBM)   │
│  │   (7-day ahead)  │      │   (7-day ahead)  │               │
│  └────────┬─────────┘      └────────┬─────────┘               │
│           │                         │                          │
│           └────────────┬────────────┘                          │
│                        ▼                                        │
│              ┌─────────────────┐                               │
│              │  PEST RISK INDEX │  (Computed feature)          │
│              └────────┬────────┘                               │
│                       │                                         │
│                       ▼                                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              BASE CLASSIFIERS (Level 0)                  │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐           │   │
│  │  │   RF   │ │  XGB   │ │  LGB   │ │  KNN   │           │   │
│  │  └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘           │   │
│  │      │          │          │          │                 │   │
│  │      └──────────┴──────────┴──────────┘                 │   │
│  │                       │                                  │   │
│  │                       ▼                                  │   │
│  │         OOF Probability Predictions                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              META-LEARNER (Level 1)                      │   │
│  │                    XGBoost                                │   │
│  │         (Trained on OOF predictions)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          ▼                                      │
│                 FINAL CROP RECOMMENDATION                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Preprocessing & Feature Engineering

### 5.1 Lag Features
**What:** Previous values of a time-series variable
**Why:** Capture temporal patterns in weather data

```python
# For humidity and rainfall, create 14 lag features each
humidity_lag_1 = humidity at t-1
humidity_lag_2 = humidity at t-2
...
humidity_lag_14 = humidity at t-14
```

**Total lag features:** 14 (humidity) + 14 (rainfall) = 28 features

### 5.2 Rolling Statistics
**What:** Moving averages and standard deviations
**Why:** Capture trends and volatility in weather

```python
# Rolling mean (3-day window)
humidity_roll_mean_3 = mean of last 3 humidity values

# Rolling std (7-day window)  
humidity_roll_std_7 = std deviation of last 7 humidity values
```

**Total rolling features:** 4 (2 for each variable)

### 5.3 Forecast Targets
**What:** Future average values (7-day ahead)
**Why:** Train forecasters to predict future weather

```python
hum_target_7d = average humidity for next 7 days
rain_target_7d = average rainfall for next 7 days
```

### 5.4 Pest Risk Index
**What:** Composite risk score based on forecasted weather
**Why:** High humidity + moderate temperature = favorable for pests

```python
def compute_pest_risk(temp, hum_fc, rain_fc):
    hum_score = hum_fc / 100                    # 0-1
    rain_score = min(1.0, rain_fc / 50)         # 0-1, capped
    temp_score = 1 if (20 <= temp <= 30) else 0 # Binary
    
    # Weighted combination
    return 0.5*hum_score + 0.3*rain_score + 0.2*temp_score
```

### 5.5 Final Feature Set
Total features for classification: **42 features**
- Base: N, P, K, pH, temperature, humidity, rainfall (7)
- Forecasts: hum_fc_7, rain_fc_7, pest_risk_index (3)
- Lag features: 28
- Rolling features: 4

---

## 6. Model Training Pipeline

### 6.1 Step 1: Preprocess (`preprocess.py`)
```bash
python python-code/preprocess.py
```
- Reads raw CSV
- Creates lag features (14 lags for humidity & rainfall)
- Creates rolling statistics
- Creates forecast targets
- Saves to `02_features.csv`

### 6.2 Step 2: Train Forecasters (`train_forecasters.py`)
```bash
python python-code/train_forecasters.py
```
- **Model:** LightGBM (Gradient Boosting)
- **Task:** Regression (predict continuous values)
- **Targets:** 7-day humidity, 7-day rainfall
- **Split:** 80% train, 20% validation
- **Early stopping:** 30 rounds

**Results:**
| Forecaster | MAE | RMSE | R² |
|------------|-----|------|-----|
| Humidity | 3.63 | 5.28 | 0.83 |
| Rainfall | 18.33 | 24.72 | 0.59 |

### 6.3 Step 3: Generate Forecast Features (`predict_forecast_features.py`)
```bash
python python-code/predict_forecast_features.py
```
- Loads trained forecasters
- Predicts `hum_fc_7` and `rain_fc_7` for all samples
- Computes `pest_risk_index`
- Saves to `03_with_forecasts.csv`

### 6.4 Step 4: Train Base Learners (`train_base_learners.py`)
```bash
python python-code/train_base_learners.py
```

**Four Base Models:**

| Model | Type | Key Hyperparameters |
|-------|------|---------------------|
| **Random Forest (RF)** | Bagging ensemble | n_estimators=200 |
| **XGBoost (XGB)** | Gradient boosting | n_estimators=200 |
| **LightGBM (LGB)** | Gradient boosting | n_estimators=200 |
| **KNN** | Instance-based | n_neighbors=7 |

**Training Method:** 5-Fold Stratified Cross-Validation
- Ensures each fold has same class distribution
- Generates Out-of-Fold (OOF) predictions for stacking

**OOF Predictions:**
- Each model outputs probability for all 22 classes
- OOF matrix: (n_samples) × (4 models × 22 classes) = 2181 × 88

### 6.5 Step 5: Train Stacking Meta-Learner (`stacking.py`)
```bash
python python-code/stacking.py
```
- **Input:** OOF predictions from base learners (88 features)
- **Model:** XGBoost Classifier
- **Task:** Learn optimal combination of base model predictions
- **Split:** 80% train, 20% test
- **Early stopping:** 30 rounds

---

## 7. Stacking Ensemble Learning

### What is Stacking?
Stacking (Stacked Generalization) is an ensemble technique that:
1. Trains multiple **base models** (Level 0)
2. Uses their predictions as features for a **meta-learner** (Level 1)
3. Meta-learner learns the optimal way to combine base predictions

### Why Stacking Works
- Different models have different **inductive biases**
- RF is good at handling outliers
- XGBoost captures complex interactions
- KNN uses local patterns
- Meta-learner learns **when to trust which model**

### Out-of-Fold (OOF) Predictions
**Problem:** If we train meta-learner on same data used to train base models, it will overfit.

**Solution:** Use K-Fold Cross-Validation
1. Split data into 5 folds
2. For each fold:
   - Train base model on 4 folds
   - Predict on held-out fold
3. Combine predictions = OOF predictions
4. Train meta-learner on OOF predictions

```
Fold 1: Train on [2,3,4,5], Predict on [1]
Fold 2: Train on [1,3,4,5], Predict on [2]
Fold 3: Train on [1,2,4,5], Predict on [3]
Fold 4: Train on [1,2,3,5], Predict on [4]
Fold 5: Train on [1,2,3,4], Predict on [5]

OOF = Concatenate predictions from all folds
```

### Our Stacking Architecture

```
Level 0 (Base Models):
├── Random Forest    → 22 class probabilities
├── XGBoost          → 22 class probabilities
├── LightGBM         → 22 class probabilities
└── KNN              → 22 class probabilities

Concatenate → 88 features (22 × 4)

Level 1 (Meta-Learner):
└── XGBoost Classifier → Final 22 class probabilities
```

---

## 8. Evaluation Metrics

### 8.1 Regression Metrics (Forecasters)

**MAE (Mean Absolute Error)**
```
MAE = (1/n) × Σ|actual - predicted|
```
- Average absolute difference between predictions and actual values
- **Lower is better**
- Easy to interpret (same units as target)

**RMSE (Root Mean Squared Error)**
```
RMSE = √[(1/n) × Σ(actual - predicted)²]
```
- Penalizes large errors more than MAE
- **Lower is better**
- More sensitive to outliers

**R² Score (Coefficient of Determination)**
```
R² = 1 - (SS_res / SS_tot)
```
- Proportion of variance explained by model
- Range: 0 to 1 (can be negative for bad models)
- **Higher is better** (1.0 = perfect)

### 8.2 Classification Metrics (Crop Recommendation)

**Accuracy**
```
Accuracy = Correct Predictions / Total Predictions
```
- Overall correctness
- **Our result: 99.09%**

**Precision (per class)**
```
Precision = True Positives / (True Positives + False Positives)
```
- "Of all predicted as Class X, how many were actually X?"
- High precision = few false positives

**Recall (per class)**
```
Recall = True Positives / (True Positives + False Negatives)
```
- "Of all actual Class X, how many did we find?"
- High recall = few false negatives

**F1-Score**
```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```
- Harmonic mean of precision and recall
- Balances both metrics
- **Our Macro F1: 0.9909**

**Macro vs Weighted Average**
- **Macro:** Average of per-class metrics (treats all classes equally)
- **Weighted:** Weighted by class support (accounts for imbalance)

### 8.3 Our Model Results

| Model | Accuracy | Macro F1 |
|-------|----------|----------|
| Random Forest | 99.41% | 0.9941 |
| XGBoost | 99.32% | 0.9932 |
| LightGBM | 99.36% | 0.9936 |
| KNN | 93.75% | 0.9322 |
| **Stacking (Final)** | **99.09%** | **0.9909** |

---

## 9. Inference Pipeline

### How Prediction Works at Runtime

```python
def predict_crop(sample):
    # 1. Load all trained models
    le = load("label_encoder.pkl")           # For decoding class labels
    feature_list = load("feature_list.pkl")  # Expected feature order
    base_models = {rf, xgb, lgb, knn}        # 4 base classifiers
    stacker = load("stacker.pkl")            # Meta-learner
    
    # 2. Prepare input features
    X = reindex(sample, feature_list)        # Ensure correct feature order
    
    # 3. Get base model predictions
    base_probs = []
    for model in base_models:
        probs = model.predict_proba(X)       # 22 class probabilities
        base_probs.append(probs)
    
    # 4. Concatenate for meta-learner
    X_meta = hstack(base_probs)              # Shape: (1, 88)
    
    # 5. Final prediction
    final_probs = stacker.predict_proba(X_meta)
    
    # 6. Return top 3 crops
    top_3_indices = argsort(final_probs)[-3:]
    return [(le.inverse_transform(i), final_probs[i]) for i in top_3_indices]
```

### Streamlit App Flow

1. User inputs: N, P, K, temperature, humidity, pH, rainfall
2. Optional: humidity/rainfall forecasts
3. Click "Recommend Crops"
4. System computes pest_risk_index
5. Runs inference pipeline
6. Displays top 3 crops with confidence scores

---

## 10. Key Concepts to Understand

### 10.1 Why LightGBM for Forecasting?
- **Gradient boosting** handles non-linear relationships
- **Efficient** with large datasets
- **Handles missing values** automatically
- Good for **tabular data** with numerical features

### 10.2 Why Multiple Base Learners?
- **Diversity** reduces overfitting
- Different algorithms capture different patterns:
  - RF: Handles noise well, uses feature bagging
  - XGBoost: Captures complex interactions
  - LightGBM: Fast, leaf-wise growth
  - KNN: Local neighborhood patterns

### 10.3 Why XGBoost as Meta-Learner?
- Can learn **non-linear combinations** of base predictions
- **Regularization** prevents overfitting
- Handles **high-dimensional** input (88 features)

### 10.4 Stratified K-Fold
- Ensures each fold has **same class distribution** as full dataset
- Critical for **imbalanced** or **multi-class** problems
- Prevents folds from missing certain classes

### 10.5 Early Stopping
- Monitors validation loss during training
- Stops when loss doesn't improve for N rounds
- **Prevents overfitting**
- Saves training time

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK REFERENCE                          │
├─────────────────────────────────────────────────────────────┤
│ Dataset: 2200 samples, 22 crops, 7 input features          │
│ Lag Features: 14 each for humidity & rainfall              │
│ Rolling Features: 3-day mean, 7-day std                    │
│ Forecast Window: 7 days                                     │
│                                                             │
│ Forecasters: LightGBM (regression)                         │
│   - Humidity: MAE=3.63, R²=0.83                            │
│   - Rainfall: MAE=18.33, R²=0.59                           │
│                                                             │
│ Base Learners: RF, XGBoost, LightGBM, KNN                  │
│ Cross-Validation: 5-fold stratified                        │
│ OOF Features: 4 models × 22 classes = 88                   │
│                                                             │
│ Meta-Learner: XGBoost Classifier                           │
│ Final Accuracy: 99.09%                                     │
│ Final Macro F1: 0.9909                                     │
│                                                             │
│ Key Libraries: scikit-learn, xgboost, lightgbm, streamlit  │
└─────────────────────────────────────────────────────────────┘
```