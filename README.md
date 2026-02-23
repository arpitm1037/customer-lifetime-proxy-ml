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
  *(Low, Medium, High, VIP)*

### Model
- **Random Forest Classifier**

**Why Random Forest?**
- Handles non-linear relationships well  
- Robust to feature scaling  
- Effective for tabular behavioral data  

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
       width="650">
</p>

### 2️⃣ Understanding Results and Exploring Customers
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6e97d1b-21d6-46ae-b175-0bb48d3e50a8"
       alt="Consumer Flow - Dashboard and Insights"
       width="650">
</p>

---

## 🖼 Consumer UI Mockups (Figma – Non-Technical View)

These mockups show how a **non-technical user** experiences the product and understands customer insights without any knowledge of machine learning or backend systems.

### 1️⃣ Welcome / Introduction Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/200437aa-9235-4f42-82b7-fa1ea2b56faa"
       alt="Welcome Screen"
       width="700">
</p>

### 2️⃣ Data Upload Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/09f9e4e2-05e8-4b13-aa0a-fdb47bb942c3"
       alt="Data Upload Screen"
       width="700">
</p>

### 3️⃣ Processing / Preparing Insights Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/2a3bdcf9-989b-4bbc-b4da-dc6a3a1431a1"
       alt="Processing Screen"
       width="700">
</p>

### 4️⃣ Customer Insights Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/e8a54c5d-44c9-4192-9139-c90eaa5757bc"
       alt="Insights Dashboard"
       width="700">
</p>

### 5️⃣ Customer Detail View
<p align="center">
  <img src="https://github.com/user-attachments/assets/acc693a2-ae26-4914-8058-b84b43a9be4d"
       alt="Customer Detail View"
       width="700">
</p>


## Feature Breakdown (WHAT the system does):-


| Feature Group           | Purpose                                                 | Capabilities                                                                                                                                                                                | User Benefit                                 |
| ----------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Data Ingestion          | Allow users to provide retail data to the system        | Upload retail transaction dataset (CSV)<br>Validate file format and required columns<br>Handle invalid or missing data gracefully<br>Store raw uploaded data for processing                 | Easy onboarding without technical knowledge  |
| Customer Analysis       | Convert raw data into meaningful customer understanding | Automatically clean transaction data<br>Generate customer-level summaries<br>Capture customer buying behavior over time<br>Prepare data for future value estimation                         | No manual analysis or spreadsheets required  |
| Future Value Estimation | Estimate which customers will be valuable               | Estimate future customer value using recent behavior<br>Group customers into value categories (Low, Medium, High, VIP)<br>Generate predictions in batch mode<br>Store predictions for reuse | Early identification of high-value customers |
| Insights & Dashboard    | Help users explore and understand results               | View customer segments by value category<br>Analyze customer cohorts over time<br>Filter insights by time range and segment<br>View individual customer details                             | Clear, actionable business insights          |
| System & Management     | Ensure reliability and repeatability                    | Save processed data and results<br>Support retraining on new datasets<br>Maintain historical results<br>Ensure consistent outputs                                                           | Stable and reusable system                   |

📌 API Planning:-

| API Category | Endpoint                            | Method | Description                                              |
| ------------ | ----------------------------------- | ------ | -------------------------------------------------------- |
| Dataset      | `/api/datasets/upload`              | POST   | Upload retail transaction dataset and trigger processing |
| Dataset      | `/api/datasets`                     | GET    | List uploaded datasets and their processing status       |
| Analysis     | `/api/analysis/run`                 | POST   | Start data processing and customer value estimation      |
| Analysis     | `/api/analysis/status/{dataset_id}` | GET    | Check processing status for a dataset                    |
| Insights     | `/api/insights/segments`            | GET    | Fetch customer segments by value category and time       |
| Insights     | `/api/insights/cohorts`             | GET    | Fetch cohort-based customer summaries                    |
| Customer     | `/api/customers/{customer_id}`      | GET    | Fetch detailed information for a single customer         |
| Model        | `/api/model/summary`                | GET    | Fetch latest model run details and evaluation metrics    |


