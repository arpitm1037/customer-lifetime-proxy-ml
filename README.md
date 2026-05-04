
# 🛒 Retail Customer Lifetime Proxy Modeling

An end-to-end **Machine Learning + Full Stack application** that predicts customer lifetime value using a **proxy-based approach** and provides actionable insights through a dashboard.

---

URL: http://retail-ltv.3.93.162.204.nip.io/

Dataset: https://archive.ics.uci.edu/dataset/352/online+retail


## 📌 Overview

Retail businesses often struggle to identify high-value customers early because true Customer Lifetime Value (CLV) requires long-term data.

This project solves that problem by:
- Using **recent customer behavior**
- Predicting **future 6-month spend**
- Grouping customers into **lifetime value buckets**

The system covers the **complete ML product lifecycle**:
Data → Features → Model → API → Dashboard → Deployment

---

## ❓ Problem Statement

True CLV is only available after long observation periods.  
This makes it difficult for businesses to:

- Identify high-value customers early  
- Take timely retention actions  
- Optimize marketing strategies  

This project builds a **proxy-based CLV prediction system** to solve this gap.

---

## ✨ Key Features

- 📂 Upload retail transaction dataset (CSV)
- 🧹 Automated data cleaning and preprocessing
- 🧮 Customer-level feature engineering:
  - Recency
  - Frequency
  - Monetary value
  - Tenure
  - Trend features
- 🎯 Future 6-month spend proxy labeling
- 🌲 Random Forest model for prediction
- 📊 Model evaluation (Macro F1-score, confusion matrix)
- 🔮 Customer lifetime bucket prediction
- 📈 Cohort-based analytics dashboard
- 👤 Customer-level insights view
- 💾 Persistent storage of features and predictions

---

## 🖼 Consumer Flow Diagrams

### 1️⃣ From Data Upload to Results
<p align="center">
  <img src="https://github.com/user-attachments/assets/dfd76aa2-8942-4535-aee8-fb0f3711b5fc" width="650">
</p>

### 2️⃣ Dashboard & Insights Flow
<p align="center">
  <img src="https://github.com/user-attachments/assets/b6e97d1b-21d6-46ae-b175-0bb48d3e50a8" width="650">
</p>

---

## 🖼 Consumer UI Mockups (Figma)

### Welcome Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/200437aa-9235-4f42-82b7-fa1ea2b56faa" width="700">
</p>

### Data Upload Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/09f9e4e2-05e8-4b13-aa0a-fdb47bb942c3" width="700">
</p>

### Processing Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/2a3bdcf9-989b-4bbc-b4da-dc6a3a1431a1" width="700">
</p>

### Dashboard
<p align="center">
  <img src="https://github.com/user-attachments/assets/e8a54c5d-44c9-4192-9139-c90eaa5757bc" width="700">
</p>

### Customer Detail View
<p align="center">
  <img src="https://github.com/user-attachments/assets/acc693a2-ae26-4914-8058-b84b43a9be4d" width="700">
</p>

---

## 🏗 System Architecture (HLD)

<p align="center">
  <img src="https://github.com/user-attachments/assets/488adf69-4108-4d11-8fc1-4fbeaa29d6a0" width="900">
</p>

---

## 🔧 Low-Level Data Flow (LLD)

<p align="center">
  <img src="https://github.com/user-attachments/assets/d81174a0-8bb9-4b27-a886-9d26592aaa9f" width="850">
</p>

---

## 🗄 Database Design (ER Diagram)

<p align="center">
  <img src="https://github.com/user-attachments/assets/5f1f6e11-3df6-406c-9e57-20dc9f31c7b1" width="800">
</p>

---

## 🗄 Database Schema Diagram

<p align="center">
  <img src="https://github.com/user-attachments/assets/2092c83c-cbe5-41ee-9e29-ac4b77903275" width="900">
</p>

---

## 🔌 API Contracts Diagram

<p align="center">
  <img src="https://github.com/user-attachments/assets/1e2788c9-ae78-4eb8-9ce1-e96fcf6f702d" width="850">
</p>

---

## 🧠 ML Approach

### Feature Engineering
- Recency (days since last purchase)
- Frequency (number of purchases)
- Monetary (total spend)
- Tenure (customer lifetime)
- Trend features (behavior over time)

### Target Variable
- Future 6-month spend
- Bucketed into:
  - Low
  - Medium
  - High
  - VIP

### Model
- Random Forest Classifier
- Handles non-linearity and feature interactions

---

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- Recharts

### Backend
- Django
- Django REST Framework

### ML / Analytics
- scikit-learn (Random Forest)
- Pandas
- NumPy

### Database
- PostgreSQL

### Deployment
- Docker
- AWS EC2

---

## 📂 Project Structure


│
├── frontend/ # React UI
├── backend/ # Django API
├── ml/ # ML pipeline (features + model)
├── database/ # Schema & migrations
├── docker/ # Docker configs
└── README.md


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <repo-url>
cd project

2️⃣ Environment Variables

Create .env file:

DATABASE_NAME=ltv_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=db
DATABASE_PORT=5432

DJANGO_SECRET_KEY=your-secret-key
DEBUG=True

3️⃣ Run with Docker

docker-compose up --build

4️⃣ Access App
Frontend: http://localhost:3000
Backend: http://localhost:8000

🔌 API Endpoints

| Endpoint                    | Method | Description       |
| --------------------------- | ------ | ----------------- |
| `/api/datasets/upload`      | POST   | Upload dataset    |
| `/api/analysis/run`         | POST   | Run ML pipeline   |
| `/api/analysis/status/{id}` | GET    | Check status      |
| `/api/insights/segments`    | GET    | Customer segments |
| `/api/insights/cohorts`     | GET    | Cohort analysis   |
| `/api/customers/{id}`       | GET    | Customer details  |


🚀 Deployment (Docker + AWS EC2)
Launch EC2 instance
Install Docker:

sudo apt update
sudo apt install docker docker-compose -y

Clone repo:
git clone <repo-url>
cd project

Run:
docker-compose up --build -d

🔄 Application Workflow
Upload dataset
Data cleaning & feature engineering
Model training & prediction
Store results in DB
View insights in dashboard

📦 Data Persistence
PostgreSQL with Docker volumes
Data persists across restarts

🔐 Security
Environment variables for secrets
Database not publicly exposed

📈 Future Improvements
SHAP explainability
XGBoost comparison
Real-time predictions
Background job queues
Multi-tenant architecture

🎯 Success Metrics
Macro F1-score > baseline
Clear customer segmentation
Meaningful cohort trends
End-to-end pipeline execution
User-friendly dashboard
Explainable model behavior


👨‍💻 Author
Arpit Mishra
B.Tech CSE (AI/ML)

