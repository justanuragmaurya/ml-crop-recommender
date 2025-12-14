
## 11. Potential Viva Questions & Answers

### Q1: What is the main innovation in your project?
**A:** The combination of dynamic weather forecasting with stacked ensemble learning. Unlike traditional systems that only use current conditions, we predict 7-day weather forecasts and compute a pest risk index, making recommendations more robust to changing conditions.

### Q2: Why did you choose stacking over other ensemble methods?
**A:** Stacking allows us to learn the optimal combination of different model types. Unlike bagging (which averages similar models) or boosting (which builds models sequentially), stacking can leverage the unique strengths of diverse algorithms like tree-based methods (RF, XGB, LGB) and instance-based methods (KNN).

### Q3: What is the purpose of Out-of-Fold predictions?
**A:** OOF predictions prevent data leakage when training the meta-learner. If we used regular predictions, the meta-learner would see the same data the base models were trained on, leading to overfitting. OOF ensures the meta-learner trains on predictions made on unseen data.

### Q4: Why use lag features?
**A:** Lag features capture temporal dependencies in weather data. Weather conditions are autocorrelated - today's humidity is related to yesterday's. By including past values, our forecasters can learn these temporal patterns.

### Q5: Explain the pest risk index calculation.
**A:** It's a composite score combining:
- Humidity forecast (50% weight) - high humidity favors pests
- Rainfall forecast (30% weight) - capped at 50mm
- Temperature (20% weight) - binary: 1 if 20-30°C (optimal pest range)

This domain-knowledge-based feature helps the model understand pest pressure.

### Q6: What are the limitations of your system?
**A:**
1. Assumes weather data has temporal ordering (may not be true for all datasets)
2. Forecasters trained on historical patterns may not capture climate change
3. Pest risk index uses fixed weights (could be learned instead)
4. Limited to 22 crop types in training data

### Q7: How would you deploy this in production?
**A:**
1. Containerize with Docker
2. Serve via Flask/FastAPI REST API
3. Store models in cloud storage (S3)
4. Use CI/CD for model updates
5. Monitor prediction drift
6. A/B test new model versions

### Q8: Why is KNN's accuracy lower than other base models?
**A:** KNN is sensitive to the curse of dimensionality. With 42 features, distance calculations become less meaningful. Tree-based methods handle high dimensions better by learning feature importance.

### Q9: What would you do if accuracy dropped to 80%?
**A:**
1. Check for data quality issues
2. Analyze error patterns (which crops are confused?)
3. Add more relevant features
4. Try different base models or hyperparameters
5. Collect more training data
6. Consider class-specific thresholds

### Q10: Explain the difference between your forecasters and classifiers.
**A:**
- **Forecasters** are regression models predicting continuous values (humidity %, rainfall mm)
- **Classifiers** predict categorical labels (crop names)
- Forecasters use Mean Absolute Error loss
- Classifiers use Cross-Entropy loss

---