import { useState, useEffect } from 'react';
import { predictCrop, healthCheck, type CropInput, type PredictionResponse } from '../api';

const defaultInput: CropInput = {
  nitrogen: 50,
  phosphorus: 50,
  potassium: 50,
  temperature: 25,
  humidity: 65,
  ph: 6.5,
  rainfall: 100,
  humidity_forecast: 65,
  rainfall_forecast: 80,
};

export default function HomePage() {
  const [input, setInput] = useState<CropInput>(defaultInput);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    healthCheck().then((ok) => setApiStatus(ok ? 'online' : 'offline'));
  }, []);

  const handleChange = (field: keyof CropInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput((prev) => ({ ...prev, [field]: parseFloat(e.target.value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await predictCrop(input);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label,
    field,
    min,
    max,
    step = 1,
    unit,
  }: {
    label: string;
    field: keyof CropInput;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }) => (
    <div>
      <label className="input-label">
        {label} {unit && <span className="text-gray-400 font-normal">({unit})</span>}
      </label>
      <input
        type="number"
        className="input-field"
        value={input[field]}
        onChange={handleChange(field)}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );

  const getRiskColor = (risk: number) => {
    if (risk < 0.3) return 'text-green-600 bg-green-50';
    if (risk < 0.6) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskLabel = (risk: number) => {
    if (risk < 0.3) return 'Low';
    if (risk < 0.6) return 'Medium';
    return 'High';
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-5xl">🌱</span>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Crop Guidance System
          </h1>
        </div>
        <p className="text-gray-600 text-lg">
          AI-powered crop recommendations using ensemble machine learning & weather forecasts
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
              apiStatus === 'online'
                ? 'bg-green-100 text-green-700'
                : apiStatus === 'offline'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                apiStatus === 'online'
                  ? 'bg-green-500'
                  : apiStatus === 'offline'
                  ? 'bg-red-500'
                  : 'bg-gray-400 animate-pulse'
              }`}
            />
            API {apiStatus === 'checking' ? 'Connecting...' : apiStatus}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Input Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Soil Nutrients */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🧪</span> Soil Nutrients
            </h2>
            <div className="space-y-4">
              <InputField label="Nitrogen" field="nitrogen" min={0} max={200} unit="N" />
              <InputField label="Phosphorus" field="phosphorus" min={0} max={200} unit="P" />
              <InputField label="Potassium" field="potassium" min={0} max={200} unit="K" />
            </div>
          </div>

          {/* Environmental */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌡️</span> Environment
            </h2>
            <div className="space-y-4">
              <InputField label="Temperature" field="temperature" min={0} max={50} step={0.1} unit="°C" />
              <InputField label="Humidity" field="humidity" min={0} max={100} step={0.1} unit="%" />
              <InputField label="Soil pH" field="ph" min={0} max={14} step={0.1} />
            </div>
          </div>

          {/* Weather */}
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🌧️</span> Weather
            </h2>
            <div className="space-y-4">
              <InputField label="Rainfall" field="rainfall" min={0} max={500} step={0.1} unit="mm" />
              <InputField label="Humidity Forecast" field="humidity_forecast" min={0} max={100} step={0.1} unit="7d %" />
              <InputField label="Rainfall Forecast" field="rainfall_forecast" min={0} max={500} step={0.1} unit="7d mm" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary flex items-center justify-center gap-2"
          disabled={loading || apiStatus === 'offline'}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <span className="text-xl">🔍</span>
              Get Crop Recommendations
            </>
          )}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-8 card">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Recommendations
          </h2>

          {/* Pest Risk */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pest Risk Index</span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(result.pest_risk_index)}`}>
                {getRiskLabel(result.pest_risk_index)} ({(result.pest_risk_index * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  result.pest_risk_index < 0.3 ? 'bg-green-500' : result.pest_risk_index < 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${result.pest_risk_index * 100}%` }}
              />
            </div>
          </div>

          {/* Crops */}
          <div className="space-y-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={rec.crop}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                  index === 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                    index === 0 ? 'bg-green-500 text-white' : index === 1 ? 'bg-gray-300 text-gray-700' : 'bg-amber-200 text-amber-800'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold capitalize ${index === 0 ? 'text-lg text-green-700' : 'text-gray-700'}`}>
                    {rec.crop}
                  </h3>
                  <p className="text-sm text-gray-500">Confidence Score</p>
                </div>
                <div className="text-right">
                  <span className={`text-2xl font-bold ${index === 0 ? 'text-green-600' : 'text-gray-600'}`}>
                    {(rec.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
