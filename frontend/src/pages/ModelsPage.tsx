const models = [
  {
    name: 'Random Forest Classifier',
    shortName: 'rf',
    icon: '🌲',
    category: 'Base Classifier',
    description:
      'An ensemble method that constructs multiple decision trees during training and outputs the class that is the mode of the classes predicted by individual trees. It reduces overfitting by averaging multiple trees trained on different subsets of the data.',
    parameters: [
      { name: 'n_estimators', value: '200', description: 'Number of trees in the forest' },
      { name: 'random_state', value: '42', description: 'Seed for reproducibility' },
    ],
  },
  {
    name: 'XGBoost Classifier',
    shortName: 'xgb',
    icon: '⚡',
    category: 'Base Classifier',
    description:
      'Extreme Gradient Boosting is a scalable and efficient implementation of gradient boosted decision trees. It uses a more regularized model to control overfitting and provides excellent performance on structured data.',
    parameters: [
      { name: 'n_estimators', value: '200', description: 'Number of boosting rounds' },
      { name: 'eval_metric', value: 'mlogloss', description: 'Multi-class log loss for evaluation' },
      { name: 'use_label_encoder', value: 'False', description: 'Disables deprecated internal label encoding' },
    ],
  },
  {
    name: 'LightGBM Classifier',
    shortName: 'lgb',
    icon: '💡',
    category: 'Base Classifier',
    description:
      'Light Gradient Boosting Machine is a fast, distributed, high-performance gradient boosting framework. It uses leaf-wise tree growth which can converge faster than level-wise approaches used in other implementations.',
    parameters: [
      { name: 'n_estimators', value: '200', description: 'Number of boosting iterations' },
      { name: 'verbosity', value: '-1', description: 'Silent mode (no logging)' },
    ],
  },
  {
    name: 'K-Nearest Neighbors',
    shortName: 'knn',
    icon: '👥',
    category: 'Base Classifier',
    description:
      'A non-parametric method that classifies samples based on the majority vote of their k nearest neighbors. Simple yet effective, it makes no assumptions about the underlying data distribution.',
    parameters: [
      { name: 'n_neighbors', value: '7', description: 'Number of neighbors to consider for classification' },
    ],
  },
  {
    name: 'XGBoost Stacker (Meta-Learner)',
    shortName: 'stacker',
    icon: '🏆',
    category: 'Meta-Learner',
    description:
      'The meta-learner that combines predictions from all base classifiers. It learns the optimal way to blend the base model outputs, typically achieving better performance than any single model.',
    parameters: [
      { name: 'objective', value: 'multi:softprob', description: 'Multi-class classification with probability output' },
      { name: 'learning_rate', value: '0.05', description: 'Step size shrinkage to prevent overfitting' },
      { name: 'max_depth', value: '4', description: 'Maximum tree depth (shallow for stacking)' },
      { name: 'n_estimators', value: '300', description: 'Number of boosting rounds' },
      { name: 'early_stopping_rounds', value: '30', description: 'Stops training if no improvement' },
    ],
  },
  {
    name: 'LightGBM Humidity Forecaster',
    shortName: 'hum_lgb',
    icon: '💧',
    category: 'Forecaster',
    description:
      'A regression model that predicts 7-day ahead humidity values based on historical humidity patterns, lag features, and rolling statistics. Used to provide forward-looking weather information for crop recommendations.',
    parameters: [
      { name: 'objective', value: 'regression', description: 'Standard regression task' },
      { name: 'metric', value: 'rmse', description: 'Root Mean Squared Error for evaluation' },
      { name: 'learning_rate', value: '0.05', description: 'Shrinkage rate' },
      { name: 'num_leaves', value: '31', description: 'Maximum number of leaves per tree' },
      { name: 'num_boost_round', value: '500', description: 'Maximum boosting iterations' },
      { name: 'stopping_rounds', value: '30', description: 'Early stopping patience' },
    ],
  },
  {
    name: 'LightGBM Rainfall Forecaster',
    shortName: 'rain_lgb',
    icon: '🌧️',
    category: 'Forecaster',
    description:
      'A regression model that predicts 7-day ahead rainfall values. It uses similar architecture to the humidity forecaster and helps the system make weather-aware crop recommendations.',
    parameters: [
      { name: 'objective', value: 'regression', description: 'Standard regression task' },
      { name: 'metric', value: 'rmse', description: 'Root Mean Squared Error for evaluation' },
      { name: 'learning_rate', value: '0.05', description: 'Shrinkage rate' },
      { name: 'num_leaves', value: '31', description: 'Maximum number of leaves per tree' },
      { name: 'num_boost_round', value: '500', description: 'Maximum boosting iterations' },
      { name: 'stopping_rounds', value: '30', description: 'Early stopping patience' },
    ],
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Base Classifier':
      return 'bg-sky-100 text-sky-800 border border-sky-200';
    case 'Meta-Learner':
      return 'bg-amber-100 text-amber-800 border border-amber-200';
    case 'Forecaster':
      return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
    default:
      return 'bg-stone-100 text-stone-700';
  }
};

export default function ModelsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 mb-4">
          Model Architecture
        </h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
          Our crop recommendation system uses a stacked ensemble approach with multiple base learners and weather forecasting models.
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="card mb-12 border-t-4 border-t-stone-400">
        <h2 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🏗️</span> Ensemble Architecture
        </h2>
        <div className="bg-stone-50 rounded-2xl p-8 border border-stone-100">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
            <div className="bg-white border-2 border-sky-100 rounded-xl p-6 min-w-[160px] shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Stage 1</div>
              <p className="text-sm text-stone-500 font-medium mb-1">Base Classifiers</p>
              <p className="text-3xl font-bold text-sky-600 mb-1">4</p>
              <p className="text-xs text-stone-400 font-mono">RF, XGB, LGB, KNN</p>
            </div>
            
            <div className="hidden md:flex flex-col items-center gap-1 text-stone-300">
               <span className="text-sm font-medium">Predictions</span>
               <span className="text-2xl">→</span>
            </div>
            
            <div className="bg-white border-2 border-amber-100 rounded-xl p-6 min-w-[160px] shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Stage 2</div>
              <p className="text-sm text-stone-500 font-medium mb-1">Meta-Learner</p>
              <p className="text-3xl font-bold text-amber-600 mb-1">1</p>
              <p className="text-xs text-stone-400 font-mono">XGBoost Stacker</p>
            </div>

            <div className="hidden md:flex flex-col items-center gap-1 text-stone-300">
               <span className="text-sm font-medium">Output</span>
               <span className="text-2xl">→</span>
            </div>

            <div className="bg-white border-2 border-green-100 rounded-xl p-6 min-w-[160px] shadow-sm relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Result</div>
              <p className="text-sm text-stone-500 font-medium mb-1">Final Prediction</p>
              <p className="text-3xl font-bold text-green-600 mb-1">22</p>
              <p className="text-xs text-stone-400 font-mono">Crop Classes</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-stone-200 flex flex-col items-center justify-center gap-2">
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-lg">🌧️</div>
              <div className="text-left">
                <p className="text-xs text-emerald-600 font-bold uppercase">Input Augmentation</p>
                <p className="text-sm font-bold text-emerald-800">Humidity & Rainfall Forecasters</p>
              </div>
            </div>
            <p className="text-xs text-stone-400">7-day forecast data injected as features</p>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div className="grid gap-6">
        {models.map((model) => (
          <div key={model.shortName} className="card hover:border-green-300/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Icon and Title */}
              <div className="shrink-0">
                <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-stone-100">
                  {model.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-stone-800">{model.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getCategoryColor(model.category)}`}>
                    {model.category}
                  </span>
                  <code className="px-2 py-0.5 bg-stone-100 text-stone-500 rounded text-xs font-mono border border-stone-200">{model.shortName}</code>
                </div>

                <p className="text-stone-600 mb-6 leading-relaxed">{model.description}</p>

                {/* Parameters Table */}
                <div className="overflow-hidden rounded-xl border border-stone-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200">
                        <th className="text-left py-2.5 px-4 font-semibold text-stone-700">Parameter</th>
                        <th className="text-left py-2.5 px-4 font-semibold text-stone-700">Value</th>
                        <th className="text-left py-2.5 px-4 font-semibold text-stone-700">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {model.parameters.map((param, idx) => (
                        <tr
                          key={param.name}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/30'}
                        >
                          <td className="py-2.5 px-4 font-mono text-sky-700 font-medium">{param.name}</td>
                          <td className="py-2.5 px-4 font-mono text-emerald-700">{param.value}</td>
                          <td className="py-2.5 px-4 text-stone-500">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cross-Validation Note */}
      <div className="mt-12 p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
        <span className="text-2xl mt-1">⚠️</span>
        <div>
          <h3 className="font-bold text-amber-900 mb-1">Rigorous Validation Strategy</h3>
          <p className="text-amber-800/80 text-sm leading-relaxed">
            Base classifiers are trained using <strong>5-fold Stratified Cross-Validation</strong> with{' '}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-amber-900 border border-amber-200 text-xs">random_state=42</code>. 
            Crucially, out-of-fold predictions are used as meta-features for the stacker to prevent data leakage.
          </p>
        </div>
      </div>
    </div>
  );
}
