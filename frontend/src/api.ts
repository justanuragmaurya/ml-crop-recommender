const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CropInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  humidity_forecast: number;
  rainfall_forecast: number;
}

export interface CropRecommendation {
  crop: string;
  confidence: number;
}

export interface PredictionResponse {
  recommendations: CropRecommendation[];
  pest_risk_index: number;
}

export async function predictCrop(input: CropInput): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Failed to get prediction');
  }

  return response.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
