import { useState, useEffect } from 'react';
import { predictCrop, healthCheck, type CropInput, type PredictionResponse } from '../api';

const defaultInput: CropInput = {
  nitrogen: 90,
  phosphorus: 42,
  potassium: 43,
  temperature: 20,
  humidity: 82,
  ph: 6.5,
  rainfall: 200,
  humidity_forecast: 80,
  rainfall_forecast: 150,
};
// 90,42,43,20.87974371,82.00274423,6.502985292000001,202.9355362,rice
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
        {label} {unit && <span className="text-stone-400 font-normal">({unit})</span>}
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

  const getRiskLabel = (risk: number) => {
    if (risk < 0.3) return 'Low';
    if (risk < 0.6) return 'Medium';
    return 'High';
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4 tracking-tight">
          Find the Perfect Crop
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Leverage our ensemble machine learning models and weather forecasts to optimize your harvest.
        </p>
        
        <div className="mt-6 flex items-center justify-center gap-2">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              apiStatus === 'online'
                ? 'bg-green-50 text-green-700 ring-1 ring-green-200/50'
                : apiStatus === 'offline'
                ? 'bg-red-50 text-red-700 ring-1 ring-red-200/50'
                : 'bg-stone-100 text-stone-600'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              {apiStatus === 'online' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  apiStatus === 'online'
                    ? 'bg-green-500'
                    : apiStatus === 'offline'
                    ? 'bg-red-500'
                    : 'bg-stone-400'
                }`}
              />
            </span>
            System {apiStatus === 'checking' ? 'Connecting...' : apiStatus === 'online' ? 'Operational' : 'Offline'}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Input Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Soil Nutrients */}
          <div className="card border-t-4 border-t-amber-500">
            <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
              <span className="text-xl w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">🧪</span> 
              Soil Nutrients
            </h2>
            <div className="space-y-4">
              <InputField label="Nitrogen" field="nitrogen" min={0} max={200} unit="N" />
              <InputField label="Phosphorus" field="phosphorus" min={0} max={200} unit="P" />
              <InputField label="Potassium" field="potassium" min={0} max={200} unit="K" />
            </div>
          </div>

          {/* Environmental */}
          <div className="card border-t-4 border-t-green-500">
            <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
              <span className="text-xl w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">🌡️</span> 
              Environment
            </h2>
            <div className="space-y-4">
              <InputField label="Temperature" field="temperature" min={0} max={50} step={0.1} unit="°C" />
              <InputField label="Humidity" field="humidity" min={0} max={100} step={0.1} unit="%" />
              <InputField label="Soil pH" field="ph" min={0} max={14} step={0.1} />
            </div>
          </div>

          {/* Weather */}
          <div className="card border-t-4 border-t-sky-500">
            <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
              <span className="text-xl w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">🌧️</span> 
              Weather Forecast
            </h2>
            <div className="space-y-4">
              <InputField label="Rainfall" field="rainfall" min={0} max={500} step={0.1} unit="mm" />
              <InputField label="Humidity (7d)" field="humidity_forecast" min={0} max={100} step={0.1} unit="%" />
              <InputField label="Rainfall (7d)" field="rainfall_forecast" min={0} max={500} step={0.1} unit="mm" />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            className="btn-primary text-lg shadow-lg shadow-green-200 hover:shadow-green-300"
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
                Processing Analysis...
              </>
            ) : (
              <>
                <span>🔍</span>
                Generate Recommendation
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3 max-w-2xl mx-auto animate-fade-in">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-bold">Analysis Failed</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-12 card border-t-4 border-t-emerald-500 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-stone-200 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-3">
                <span className="text-3xl">🎯</span> Optimal Crops Found
              </h2>
              <p className="text-stone-500 mt-1">Based on soil composition and weather patterns</p>
            </div>
            
            {/* Pest Risk Badge */}
            <div className="flex flex-col items-end">
               <div className={`px-4 py-2 rounded-xl flex items-center gap-3 ${
                 result.pest_risk_index < 0.3 ? 'bg-green-50 border border-green-200' : 
                 result.pest_risk_index < 0.6 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'
               }`}>
                 <div className="text-right">
                   <p className="text-xs font-semibold uppercase tracking-wider opacity-70">Pest Risk Index</p>
                   <p className={`font-bold text-lg leading-none ${
                     result.pest_risk_index < 0.3 ? 'text-green-700' : 
                     result.pest_risk_index < 0.6 ? 'text-amber-700' : 'text-red-700'
                   }`}>
                     {getRiskLabel(result.pest_risk_index)}
                   </p>
                 </div>
                 <div className="w-12 h-12 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-black/5" />
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" 
                        strokeDasharray={125.6} 
                        strokeDashoffset={125.6 * (1 - result.pest_risk_index)}
                        className={result.pest_risk_index < 0.3 ? 'text-green-500' : result.pest_risk_index < 0.6 ? 'text-amber-500' : 'text-red-500'} 
                      />
                    </svg>
                 </div>
               </div>
            </div>
          </div>

          {/* Crops List */}
          <div className="grid gap-4">
            {result.recommendations.map((rec, index) => (
              <div
                key={rec.crop}
                className={`relative overflow-hidden flex items-center gap-5 p-5 rounded-2xl transition-all duration-300 group hover:shadow-md ${
                  index === 0 
                    ? 'bg-linear-to-r from-emerald-50 to-green-50 border border-emerald-200 shadow-sm' 
                    : 'bg-white border border-stone-100'
                }`}
              >
                <div
                  className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-sm ${
                    index === 0 ? 'bg-emerald-500 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {index + 1}
                </div>
                
                <div className="flex-1 z-10">
                  <h3 className={`font-bold text-xl capitalize mb-1 ${index === 0 ? 'text-emerald-900' : 'text-stone-700'}`}>
                    {rec.crop}
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-stone-200 rounded-full max-w-[200px] overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${index === 0 ? 'bg-emerald-500' : 'bg-stone-400'}`} 
                        style={{ width: `${rec.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-stone-500">{(rec.confidence * 100).toFixed(1)}% Match</span>
                  </div>
                </div>

                {index === 0 && (
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-emerald-100/50 to-transparent pointer-events-none" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
