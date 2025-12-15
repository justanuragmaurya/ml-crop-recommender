const classifierMetrics = [
  {
    name: 'Random Forest',
    shortName: 'rf',
    icon: '🌲',
    accuracy: 0.9932,
    f1: 0.9931,
    description: 'Strong baseline with robust performance across all classes.',
  },
  {
    name: 'XGBoost',
    shortName: 'xgb',
    icon: '⚡',
    accuracy: 0.9955,
    f1: 0.9954,
    description: 'Excellent gradient boosting performance with low variance.',
  },
  {
    name: 'LightGBM',
    shortName: 'lgb',
    icon: '💡',
    accuracy: 0.9932,
    f1: 0.993,
    description: 'Fast training with competitive accuracy.',
  },
  {
    name: 'K-Nearest Neighbors',
    shortName: 'knn',
    icon: '👥',
    accuracy: 0.9773,
    f1: 0.9769,
    description: 'Solid non-parametric baseline.',
  },
];

const stackerMetrics = {
  name: 'XGBoost Stacker',
  icon: '🏆',
  accuracy: 0.9977,
  f1: 0.9976,
  description: 'Meta-learner combining all base classifier predictions for optimal performance.',
};

const forecasterMetrics = [
  {
    name: 'Humidity Forecaster',
    shortName: 'hum_lgb',
    icon: '💧',
    mae: 4.32,
    rmse: 6.18,
    description: '7-day humidity prediction using lag features and rolling statistics.',
  },
  {
    name: 'Rainfall Forecaster',
    shortName: 'rain_lgb',
    icon: '🌧️',
    mae: 12.45,
    rmse: 18.72,
    description: '7-day rainfall prediction to enhance crop recommendations.',
  },
];

const getAccuracyColor = (accuracy: number) => {
  if (accuracy >= 0.99) return 'text-green-700';
  if (accuracy >= 0.95) return 'text-sky-700';
  return 'text-amber-700';
};

const getProgressColor = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio >= 0.99) return 'bg-green-500';
  if (ratio >= 0.95) return 'bg-sky-500';
  return 'bg-amber-500';
};

export default function MetricsPage() {
  const maxClassifierAccuracy = Math.max(...classifierMetrics.map((m) => m.accuracy), stackerMetrics.accuracy);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
          Performance Metrics
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
          Evaluation results from stratified cross-validation and held-out test sets.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="card bg-green-50/50 border border-green-100 hover:border-green-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-green-700 font-bold uppercase tracking-wider">Top Accuracy</p>
              <p className="text-4xl font-bold text-stone-800 mt-1">{(stackerMetrics.accuracy * 100).toFixed(2)}%</p>
            </div>
            <span className="text-3xl bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">🏆</span>
          </div>
          <p className="text-sm text-green-700 font-medium">Stacked Ensemble</p>
        </div>

        <div className="card bg-sky-50/50 border border-sky-100 hover:border-sky-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-sky-700 font-bold uppercase tracking-wider">Best F1 Score</p>
              <p className="text-4xl font-bold text-stone-800 mt-1">{(stackerMetrics.f1 * 100).toFixed(2)}%</p>
            </div>
            <span className="text-3xl bg-sky-100 w-12 h-12 rounded-full flex items-center justify-center">🎯</span>
          </div>
          <p className="text-sm text-sky-700 font-medium">Balanced across classes</p>
        </div>

        <div className="card bg-amber-50/50 border border-amber-100 hover:border-amber-200 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-amber-700 font-bold uppercase tracking-wider">Validation</p>
              <p className="text-4xl font-bold text-stone-800 mt-1">5-Fold</p>
            </div>
            <span className="text-3xl bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center">🔄</span>
          </div>
          <p className="text-sm text-amber-700 font-medium">Stratified Sampling</p>
        </div>
      </div>

      {/* Stacker Highlight */}
      <div className="card mb-10 border-t-4 border-t-amber-500">
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <div className="shrink-0 text-center md:w-48">
            <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center text-5xl mx-auto mb-3 border-4 border-amber-100 shadow-sm">
              {stackerMetrics.icon}
            </div>
            <span className="font-bold text-lg text-stone-800 block">{stackerMetrics.name}</span>
            <span className="text-xs font-semibold uppercase text-amber-600 tracking-wider">Champion Model</span>
          </div>
          <div className="flex-1 bg-stone-50 rounded-2xl p-6 border border-stone-100">
            <p className="text-stone-600 mb-6 italic">"{stackerMetrics.description}"</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                   <p className="text-sm text-stone-500 font-medium">Accuracy</p>
                   <span className="font-mono font-bold text-stone-800">{(stackerMetrics.accuracy * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stackerMetrics.accuracy * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-end mb-2">
                   <p className="text-sm text-stone-500 font-medium">F1 Score</p>
                   <span className="font-mono font-bold text-stone-800">{(stackerMetrics.f1 * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${stackerMetrics.f1 * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Base Classifiers */}
      <div className="card mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📊</span> Base Classifier Comparison
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-stone-100">
                <th className="text-left py-4 px-4 font-bold text-stone-700">Model</th>
                <th className="text-left py-4 px-4 font-bold text-stone-700">Accuracy</th>
                <th className="text-left py-4 px-4 font-bold text-stone-700">F1</th>
                <th className="text-left py-4 px-4 font-bold text-stone-700 hidden md:table-cell">Strengths</th>
              </tr>
            </thead>
            <tbody>
              {classifierMetrics.map((model, idx) => (
                <tr key={model.shortName} className={`border-b border-stone-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/50'}`}>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xl">
                        {model.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">{model.name}</p>
                        <code className="text-xs text-stone-400 font-mono">{model.shortName}</code>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold ${getAccuracyColor(model.accuracy)}`}>
                        {(model.accuracy * 100).toFixed(2)}%
                      </span>
                      <div className="w-16 bg-stone-200 rounded-full h-1.5 hidden sm:block">
                        <div
                          className={`h-1.5 rounded-full ${getProgressColor(model.accuracy, maxClassifierAccuracy)}`}
                          style={{ width: `${(model.accuracy / maxClassifierAccuracy) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-mono font-bold ${getAccuracyColor(model.f1)}`}>
                        {(model.f1 * 100).toFixed(2)}%
                      </span>
                      <div className="w-16 bg-stone-200 rounded-full h-1.5 hidden sm:block">
                        <div
                          className={`h-1.5 rounded-full ${getProgressColor(model.f1, maxClassifierAccuracy)}`}
                          style={{ width: `${(model.f1 / maxClassifierAccuracy) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-stone-500 text-sm hidden md:table-cell">{model.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Forecasters */}
      <div className="card mb-10">
        <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🌤️</span> Weather Forecaster Performance
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {forecasterMetrics.map((model) => (
            <div key={model.shortName} className="bg-linear-to-br from-stone-50 to-white rounded-2xl p-6 border border-stone-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-2xl shadow-sm">
                    {model.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-800">{model.name}</h3>
                    <code className="text-xs text-stone-400 font-mono">{model.shortName}</code>
                  </div>
                </div>
              </div>
              
              <p className="text-stone-600 text-sm mb-6 bg-white p-3 rounded-lg border border-stone-100">{model.description}</p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">MAE</p>
                  <p className="text-2xl font-bold text-emerald-600">{model.mae.toFixed(2)}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl border border-stone-100 shadow-sm">
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-wider mb-1">RMSE</p>
                  <p className="text-2xl font-bold text-sky-600">{model.rmse.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Metrics Key */}
      <div className="card bg-stone-50 border border-stone-200">
        <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
           <span className="text-xl">💡</span> Metric Definitions
        </h3>
        <div className="grid md:grid-cols-2 gap-8 text-sm">
           <div>
             <h4 className="font-bold text-stone-700 mb-2 border-b border-stone-200 pb-1">Classification (Crops)</h4>
             <dl className="grid grid-cols-[80px_1fr] gap-y-2">
               <dt className="font-mono text-stone-500">Accuracy</dt>
               <dd className="text-stone-600">The proportion of correctly classified predictions.</dd>
               <dt className="font-mono text-stone-500">F1 Score</dt>
               <dd className="text-stone-600">Harmonic mean of precision and recall. Useful for imbalanced datasets.</dd>
             </dl>
           </div>
           <div>
             <h4 className="font-bold text-stone-700 mb-2 border-b border-stone-200 pb-1">Regression (Weather)</h4>
             <dl className="grid grid-cols-[80px_1fr] gap-y-2">
               <dt className="font-mono text-stone-500">MAE</dt>
               <dd className="text-stone-600">Mean Absolute Error. Average absolute difference between predicted and actual values.</dd>
               <dt className="font-mono text-stone-500">RMSE</dt>
               <dd className="text-stone-600">Root Mean Square Error. Penalizes larger errors more heavily.</dd>
             </dl>
           </div>
        </div>
      </div>
    </div>
  );
}
