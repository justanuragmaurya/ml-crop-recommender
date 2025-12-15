from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Tuple
import joblib
import pandas as pd
import numpy as np
import os

app = FastAPI(
    title="Crop Recommendation API",
    description="DCF-SEL Crop Guidance System - Powered by Stacked Ensemble ML",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model paths (relative to backend directory)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "ml-models")

# Global model cache
models_cache = {}


class CropInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=200, description="Nitrogen content (N)")
    phosphorus: float = Field(..., ge=0, le=200, description="Phosphorus content (P)")
    potassium: float = Field(..., ge=0, le=200, description="Potassium content (K)")
    temperature: float = Field(..., ge=0, le=50, description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Humidity percentage")
    ph: float = Field(..., ge=0, le=14, description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=500, description="Rainfall in mm")
    humidity_forecast: float = Field(default=65.0, ge=0, le=100, description="7-day humidity forecast")
    rainfall_forecast: float = Field(default=80.0, ge=0, le=500, description="7-day rainfall forecast")


class CropRecommendation(BaseModel):
    crop: str
    confidence: float


class PredictionResponse(BaseModel):
    recommendations: List[CropRecommendation]
    pest_risk_index: float


def load_models():
    """Load all ML models into cache"""
    global models_cache
    if models_cache:
        return models_cache
    
    try:
        models_cache = {
            "label_encoder": joblib.load(os.path.join(MODEL_DIR, "scalers", "label_encoder.pkl")),
            "feature_list": joblib.load(os.path.join(MODEL_DIR, "feature_list.pkl")),
            "stacker": joblib.load(os.path.join(MODEL_DIR, "meta_learner", "stacker.pkl")),
            "base_models": {
                "rf": joblib.load(os.path.join(MODEL_DIR, "base_classifiers", "rf_full.pkl")),
                "xgb": joblib.load(os.path.join(MODEL_DIR, "base_classifiers", "xgb_full.pkl")),
                "lgb": joblib.load(os.path.join(MODEL_DIR, "base_classifiers", "lgb_full.pkl")),
                "knn": joblib.load(os.path.join(MODEL_DIR, "base_classifiers", "knn_full.pkl")),
            }
        }
        return models_cache
    except Exception as e:
        raise RuntimeError(f"Failed to load models: {str(e)}")


def compute_pest_risk(temp: float, hum_fc: float, rain_fc: float) -> float:
    """Calculate pest risk index based on environmental factors"""
    hum_score = hum_fc / 100
    rain_score = min(1.0, rain_fc / 50)
    temp_score = 1 if (20 <= temp <= 30) else 0
    return float(np.clip(0.5 * hum_score + 0.3 * rain_score + 0.2 * temp_score, 0, 1))


def predict_crop(sample: dict) -> List[Tuple[str, float]]:
    """Make crop prediction using stacked ensemble"""
    models = load_models()
    le = models["label_encoder"]
    feature_list = models["feature_list"]
    base_models = models["base_models"]
    stacker = models["stacker"]
    
    # Prepare input data
    df = pd.DataFrame([sample])
    df = df.reindex(columns=feature_list, fill_value=0)
    
    # Get base model predictions
    base_probs = []
    for name, model in base_models.items():
        base_probs.append(model.predict_proba(df))
    
    # Stack predictions for meta learner
    X_meta = np.hstack(base_probs)
    final_probs = stacker.predict_proba(X_meta)[0]
    
    # Get top 3 predictions
    top_idx = final_probs.argsort()[::-1][:3]
    crops = le.inverse_transform(top_idx)
    scores = final_probs[top_idx]
    
    return list(zip(crops, scores))


@app.on_event("startup")
async def startup_event():
    """Pre-load models on startup"""
    try:
        load_models()
        print("✅ Models loaded successfully")
    except Exception as e:
        print(f"⚠️ Model loading deferred: {e}")


@app.get("/")
async def root():
    return {
        "message": "🌱 DCF-SEL Crop Guidance API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(input_data: CropInput):
    """
    Get crop recommendations based on soil and environmental parameters.
    Returns top 3 recommended crops with confidence scores and pest risk index.
    """
    try:
        # Build sample dict matching expected feature names
        sample = {
            "n": input_data.nitrogen,
            "p": input_data.phosphorus,
            "k": input_data.potassium,
            "temperature": input_data.temperature,
            "humidity": input_data.humidity,
            "ph": input_data.ph,
            "rainfall": input_data.rainfall,
            "hum_fc_7": input_data.humidity_forecast,
            "rain_fc_7": input_data.rainfall_forecast,
            "pest_risk_index": compute_pest_risk(
                input_data.temperature,
                input_data.humidity_forecast,
                input_data.rainfall_forecast
            )
        }
        
        # Get predictions
        results = predict_crop(sample)
        
        recommendations = [
            CropRecommendation(crop=crop, confidence=round(float(score), 4))
            for crop, score in results
        ]
        
        return PredictionResponse(
            recommendations=recommendations,
            pest_risk_index=round(sample["pest_risk_index"], 4)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/crops")
async def get_available_crops():
    """Get list of all possible crop recommendations"""
    try:
        models = load_models()
        crops = list(models["label_encoder"].classes_)
        return {"crops": crops, "count": len(crops)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
