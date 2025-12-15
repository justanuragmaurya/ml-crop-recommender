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
      return 'bg-blue-100 text-blue-700';
    case 'Meta-Learner':
      return 'bg-purple-100 text-purple-700';
    case 'Forecaster':
      return 'bg-teal-100 text-teal-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export default function ModelsPage() {
  return (
    <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">🤖</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Model Architecture
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Our crop recommendation system uses a stacked ensemble approach with multiple base learners and weather
            forecasting models.
          </p>
        </div>

        {/* Architecture Overview */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-2xl">🏗️</span> Ensemble Architecture
          </h2>
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 min-w-[150px]">
                <p className="text-sm text-blue-600 font-medium">Base Classifiers</p>
                <p className="text-2xl font-bold text-blue-700">4</p>
                <p className="text-xs text-gray-500">RF, XGB, LGB, KNN</p>
              </div>
              <span className="text-3xl text-gray-400">→</span>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 min-w-[150px]">
                <p className="text-sm text-purple-600 font-medium">Meta-Learner</p>
                <p className="text-2xl font-bold text-purple-700">1</p>
                <p className="text-xs text-gray-500">XGBoost Stacker</p>
              </div>
              <span className="text-3xl text-gray-400">→</span>
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 min-w-[150px]">
                <p className="text-sm text-green-600 font-medium">Final Prediction</p>
                <p className="text-2xl font-bold text-green-700">22</p>
                <p className="text-xs text-gray-500">Crop Classes</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-center gap-4">
              <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-3">
                <p className="text-xs text-teal-600 font-medium">Forecasters</p>
                <p className="text-sm font-bold text-teal-700">Humidity & Rainfall</p>
              </div>
              <span className="text-gray-400">feeding into classifiers</span>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid gap-6">
          {models.map((model) => (
            <div key={model.shortName} className="card hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                {/* Icon and Title */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl">
                    {model.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{model.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(model.category)}`}>
                      {model.category}
                    </span>
                    <code className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{model.shortName}</code>
                  </div>

                  <p className="text-gray-600 mb-4">{model.description}</p>

                  {/* Parameters Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 font-semibold text-gray-700 bg-gray-50 rounded-tl-lg">
                            Parameter
                          </th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700 bg-gray-50">Value</th>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700 bg-gray-50 rounded-tr-lg">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {model.parameters.map((param, idx) => (
                          <tr
                            key={param.name}
                            className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                          >
                            <td className="py-2 px-3 font-mono text-blue-600">{param.name}</td>
                            <td className="py-2 px-3 font-mono text-green-600">{param.value}</td>
                            <td className="py-2 px-3 text-gray-600">{param.description}</td>
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
        <div className="mt-8 card bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Training Methodology</h3>
              <p className="text-amber-700 text-sm">
                Base classifiers are trained using <strong>5-fold Stratified Cross-Validation</strong> with{' '}
                <code className="bg-amber-100 px-1 rounded">random_state=42</code>. Out-of-fold predictions are used as
                meta-features for the stacker, ensuring no data leakage during the stacking process.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
