# 🛒 Retail LTV Proxy Modeling

## 📌 Overview
This project is an **end-to-end data science system** that predicts **customer lifetime value using a proxy-based approach** on retail transaction data. Instead of waiting years to observe true CLV, the system leverages **recent customer behavior** to predict **future spend buckets**, enabling early customer segmentation and cohort analysis.

The project covers the complete ML lifecycle — from raw data ingestion and feature engineering to model training, evaluation, storage, and interactive dashboards.

---

## ❓ Problem Statement
Retail businesses need to identify **high-value customers early**, but true customer lifetime value is only observable after long periods. This project addresses that gap by predicting **6-month future spend buckets** as a proxy for customer lifetime value using historical transaction data.

---

## ✨ Key Features
- 📂 Upload retail transaction datasets (customer–invoice level)
- 🧹 Automated data cleaning and preprocessing
- 🧮 Customer-level feature engineering:
  - Recency  
  - Frequency  
  - Monetary value  
  - Tenure  
  - Spending trend features
- 🎯 Proxy label generation using future 6-month spend
- 🌲 Random Forest model training and evaluation
- 📊 Model evaluation metrics:
  - Macro F1-score  
  - Confusion matrix
- 🔮 Batch prediction of customer lifetime buckets
- 💾 Persistent storage of features, predictions, and cohorts
- 📈 Cohort-based analytics dashboard:
  - Segmentation by predicted lifetime bucket  
  - Cohorts by first purchase month
- 👤 Customer-level detail view with features and predictions

---

## 📊 Data
**Dataset Used:** Online Retail Dataset (UCI Repository)

**Data Grain**
- Raw data: Customer × Invoice × Timestamp  
- Modeled data: Customer-level aggregates  

---

## 🧠 ML Approach

### Feature Engineering
Customer behavior is summarized using engineered features:
- **Recency:** Days since last purchase  
- **Frequency:** Number of purchase events  
- **Monetary:** Total and average spend  
- **Tenure:** Time since first purchase  
- **Trend Features:** Change in spending behavior over time  

### Target Variable (Proxy Label)
- Future **6-month spend** is calculated per customer  
- Customers are bucketed into discrete lifetime proxy classes  
  (Low, Medium, High, VIP)

### Model
- **Random Forest Classifier**

**Why Random Forest?**
- Handles non-linear relationships well  
- Robust to feature scaling  
- Works effectively with tabular behavioral data  

---

## 🛠 Tech Stack
- **Frontend:** React, Tailwind CSS, Recharts  
- **Backend / API:** Django  
- **ML / Analytics:** scikit-learn (Random Forest), Pandas, NumPy  
- **Database:** PostgreSQL  
- **Deployment:** Docker, Single VM (AWS EC2 or equivalent)

---

## 📏 Evaluation Metrics
- Macro F1-score (handles class imbalance)
- Confusion matrix for per-class performance analysis

---

## 🎯 Use Cases
- Identify high-value customers early  
- Segment customers for targeted campaigns  
- Analyze customer cohorts over time  
- Support data-driven retention and growth strategies  

---

## ⚠️ Limitations
- Lifetime value is approximated using a proxy, not true CLV  
- Model performance depends on historical data quality  
- Predictions are batch-based (not real-time inference)

---

## 🚀 Future Improvements
- SHAP-based explainability  
- Temporal backtesting  
- Incremental model retraining  
- Model comparison (e.g., XGBoost)  
- Real-time inference support  

---

## 📌 Project Status
- ✅ Core features completed  
- 🚧 Improvements in progress  

---

## 👨‍💻 Author
**Arpit Mishra**  
B.Tech CSE (AI/ML)  
Data Science & Machine Learning Enthusiast  

---

## 📊 Consumer Flow Diagrams

### 1️⃣ From First Use to “Results Are Ready”
<p align="center">
  <img src="https://github.com/user-attachments/assets/dfd76aa2-8942-4535-aee8-fb0f3711b5fc" 
       alt="Consumer Flow - Data Upload to Results" 
       width="700">
</p>

### 2️⃣ Understanding Results and Exploring Customers
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6e97d1b-21d6-46ae-b175-0bb48d3e50a8" 
       alt="Consumer Flow - Dashboard and Insights" 
       width="700">
</p>
