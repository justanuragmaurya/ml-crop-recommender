# 🌱 DCF-SEL Crop Guidance System

**Dynamic Crop Forecast + Stacked Ensemble Learning for Crop Recommendation**

This project provides intelligent crop recommendations based on soil parameters, weather conditions, and forecasted climate data using a stacked ensemble machine learning approach.

## 📁 Project Structure

```
project-root/
├─ data/
│  ├─ raw/
│  │  └─ Crop_recommendation.csv
│  ├─ processed/
│  │  ├─ 02_features.csv
│  │  ├─ 03_with_forecasts.csv
│  │  └─ oof_preds.csv
│
├─ ml-models/
│  ├─ forecasters/
│  ├─ base_classifiers/
│  ├─ meta_learner/
│  └─ scalers/
│
├─ python-code/
│  ├─ requirements.txt
│  ├─ utils.py
│  ├─ preprocess.py
│  ├─ train_forecasters.py
│  ├─ predict_forecast_features.py
│  ├─ train_base_learners.py
│  ├─ stacking.py
│  ├─ predict_recommendation.py
│  └─ app.py  (Streamlit frontend - legacy)
│
├─ backend/              # FastAPI backend
│  ├─ main.py
│  └─ requirements.txt
│
├─ frontend/             # React + Vite frontend
│  ├─ src/
│  ├─ package.json
│  └─ ...
│
└─ README.md
```

## 🚀 Installation

1. Clone or download this repository
2. Install dependencies:

```bash
pip install -r python-code/requirements.txt
```

## 🔄 Training Pipeline

Run the following scripts in order from the project root directory:

```bash
# Step 1: Preprocess raw data and create lag features
python python-code/preprocess.py

# Step 2: Train humidity and rainfall forecasters
python python-code/train_forecasters.py

# Step 3: Generate forecast features for the dataset
python python-code/predict_forecast_features.py

# Step 4: Train base classifiers with cross-validation
python python-code/train_base_learners.py

# Step 5: Train the meta-learner (stacking ensemble)
python python-code/stacking.py
```

## 🌐 Running the Web Application

### Option 1: FastAPI + React (Recommended)

**Start the Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at http://localhost:8000 (API docs at http://localhost:8000/docs)

**Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at http://localhost:5173

### Option 2: Streamlit (Legacy)

```bash
streamlit run python-code/app.py
```

---

The web interface allows you to input:
- **Soil Parameters**: N, P, K, pH
- **Weather Conditions**: Temperature, Humidity, Rainfall
- **Forecast Data** (optional): 7-day humidity and rainfall forecasts

## 🧠 Model Architecture

### 1. Forecasters (LightGBM)
- **Humidity Forecaster**: Predicts 7-day average humidity
- **Rainfall Forecaster**: Predicts 7-day average rainfall

### 2. Base Classifiers
- Random Forest (200 trees)
- XGBoost Classifier
- LightGBM Classifier
- K-Nearest Neighbors (k=7)

### 3. Meta-Learner (Stacking)
- XGBoost classifier trained on out-of-fold predictions from base models
- Combines predictions from all base classifiers for final recommendation

### 4. Feature Engineering
- Lag features (14 lags for humidity and rainfall)
- Rolling statistics (3-day mean, 7-day std)
- Pest risk index (computed from temperature and forecasts)

## 📊 Input Features

| Feature | Description | Range |
|---------|-------------|-------|
| N | Nitrogen content in soil | 0-200 |
| P | Phosphorus content in soil | 0-200 |
| K | Potassium content in soil | 0-200 |
| temperature | Temperature in Celsius | 0-50 |
| humidity | Current humidity percentage | 0-100 |
| ph | Soil pH level | 0-14 |
| rainfall | Rainfall in mm | 0-500 |
| hum_fc_7 | 7-day humidity forecast | 0-100 |
| rain_fc_7 | 7-day rainfall forecast | 0-500 |

## 📈 Output

The system provides:
- **Top 3 crop recommendations** with confidence scores
- Rankings based on stacked ensemble predictions

## 🔧 Technical Details

- **ML Framework**: scikit-learn, XGBoost, LightGBM
- **Backend**: FastAPI + Uvicorn
- **Frontend**: React + Vite + Tailwind CSS
- **Legacy Frontend**: Streamlit
- **Cross-validation**: 5-fold stratified
- **Random seed**: 42 (for reproducibility)

## 📝 License

This project is for educational and research purposes.

