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
  if (accuracy >= 0.99) return 'text-green-600';
  if (accuracy >= 0.95) return 'text-blue-600';
  return 'text-amber-600';
};

const getProgressColor = (value: number, max: number) => {
  const ratio = value / max;
  if (ratio >= 0.99) return 'bg-green-500';
  if (ratio >= 0.95) return 'bg-blue-500';
  return 'bg-amber-500';
};

export default function MetricsPage() {
  const maxClassifierAccuracy = Math.max(...classifierMetrics.map((m) => m.accuracy), stackerMetrics.accuracy);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">📈</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Model Performance
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Evaluation metrics from our trained models, validated using stratified cross-validation and held-out test
            sets.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <div>
                <p className="text-sm text-green-600 font-medium">Best Accuracy</p>
                <p className="text-3xl font-bold text-green-700">{(stackerMetrics.accuracy * 100).toFixed(2)}%</p>
              </div>
            </div>
            <p className="text-sm text-green-600">Stacked Ensemble</p>
          </div>

          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="text-sm text-blue-600 font-medium">Best  F1</p>
                <p className="text-3xl font-bold text-blue-700">{(stackerMetrics.f1 * 100).toFixed(2)}%</p>
              </div>
            </div>
            <p className="text-sm text-blue-600">Balanced across all 22 crops</p>
          </div>

          <div className="card bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔄</span>
              <div>
                <p className="text-sm text-purple-600 font-medium">Cross-Validation</p>
                <p className="text-3xl font-bold text-purple-700">5-Fold</p>
              </div>
            </div>
            <p className="text-sm text-purple-600">Stratified sampling</p>
          </div>
        </div>

        {/* Stacker Highlight */}
        <div className="card mb-8 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-amber-300">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-shrink-0 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-2 shadow-lg">
                {stackerMetrics.icon}
              </div>
              <span className="font-bold text-amber-800">{stackerMetrics.name}</span>
            </div>
            <div className="flex-1">
              <p className="text-amber-700 mb-4">{stackerMetrics.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-amber-600 font-medium mb-1">Accuracy</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-amber-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full"
                        style={{ width: `${stackerMetrics.accuracy * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-amber-800">{(stackerMetrics.accuracy * 100).toFixed(2)}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-amber-600 font-medium mb-1"> F1 Score</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-amber-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full"
                        style={{ width: `${stackerMetrics.f1 * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-amber-800">{(stackerMetrics.f1 * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Base Classifiers */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> Base Classifier Performance
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700"> F1</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 hidden md:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {classifierMetrics.map((model, idx) => (
                  <tr key={model.shortName} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{model.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-800">{model.name}</p>
                          <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                            {model.shortName}
                          </code>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(model.accuracy, maxClassifierAccuracy)}`}
                            style={{ width: `${(model.accuracy / maxClassifierAccuracy) * 100}%` }}
                          />
                        </div>
                        <span className={`font-mono font-semibold ${getAccuracyColor(model.accuracy)}`}>
                          {(model.accuracy * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getProgressColor(model.f1, maxClassifierAccuracy)}`}
                            style={{ width: `${(model.f1 / maxClassifierAccuracy) * 100}%` }}
                          />
                        </div>
                        <span className={`font-mono font-semibold ${getAccuracyColor(model.f1)}`}>
                          {(model.f1 * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600 text-sm hidden md:table-cell">{model.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecasters */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌤️</span> Weather Forecaster Performance
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {forecasterMetrics.map((model) => (
              <div key={model.shortName} className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-5 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl">
                    {model.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{model.name}</h3>
                    <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">{model.shortName}</code>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium">MAE</p>
                    <p className="text-2xl font-bold text-teal-600">{model.mae.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Mean Absolute Error</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-500 uppercase font-medium">RMSE</p>
                    <p className="text-2xl font-bold text-blue-600">{model.rmse.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Root Mean Squared Error</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Explanation */}
        <div className="card bg-gradient-to-r from-slate-50 to-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span> Understanding the Metrics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Classification Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-800">Accuracy:</strong> Percentage of correctly classified samples out of
                  all samples.
                </li>
                <li>
                  <strong className="text-gray-800"> F1:</strong> Unweighted average of F1 scores across all
                  classes. Better for imbalanced datasets.
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Regression Metrics</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <strong className="text-gray-800">MAE:</strong> Mean Absolute Error - average magnitude of errors
                  without considering direction.
                </li>
                <li>
                  <strong className="text-gray-800">RMSE:</strong> Root Mean Squared Error - penalizes larger errors
                  more heavily than MAE.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}
