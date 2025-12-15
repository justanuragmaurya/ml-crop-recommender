# Crop Guidance Backend

FastAPI backend for the DCF-SEL Crop Guidance System.

## Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --reload
```

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /predict` - Get crop recommendations
- `GET /crops` - List available crops
- `GET /docs` - Interactive API documentation

## Example Request

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 50,
    "phosphorus": 50,
    "potassium": 50,
    "temperature": 25,
    "humidity": 65,
    "ph": 6.5,
    "rainfall": 100,
    "humidity_forecast": 65,
    "rainfall_forecast": 80
  }'
```
