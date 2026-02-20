Retail LTV Proxy Modeling
Overview

This project is an end-to-end data science system that predicts customer lifetime value using a proxy-based approach on retail transaction data. Instead of relying on true lifetime value (which requires years of data), the system uses recent customer behavior to predict future spend buckets, enabling early customer segmentation and cohort analysis.

The project covers the complete ML lifecycle — from raw data ingestion and feature engineering to model training, evaluation, storage, and interactive analytics dashboards.

Problem Statement

Retail businesses often need to identify high-value customers early, but true customer lifetime value is only observable after long periods. This project solves that gap by predicting 6-month future spend buckets as a proxy for customer lifetime value using historical transaction behavior.

Key Features

Upload retail transaction datasets (customer–invoice level)

Automated data cleaning and preprocessing

Customer-level feature engineering:

Recency

Frequency

Monetary value

Tenure

Spending trend features

Proxy label generation using future 6-month spend

Random Forest model training and evaluation

Model evaluation metrics:

Macro F1-score

Confusion matrix

Batch prediction of customer lifetime buckets

Persistent storage of features, predictions, and cohorts

Cohort-based analytics dashboard:

Segmentation by predicted lifetime bucket

Cohorts by first purchase / signup month

Customer-level detail view with features and predictions

Data

Dataset Used: Online Retail Dataset (UCI Repository)

Data Grain:

Raw data: Customer × Invoice × Timestamp

Modeled data: Customer-level aggregates

ML Approach
Feature Engineering

Customer behavior is summarized using engineered features:

Recency: Days since last purchase

Frequency: Number of purchase events

Monetary: Total and average spend

Tenure: Time since first purchase

Trend features: Change in spending behavior over time

Target Variable (Proxy Label)

Future 6-month spend is calculated per customer

Customers are bucketed into discrete lifetime proxy classes (e.g., Low, Medium, High, VIP)

Model

Random Forest Classifier

Chosen for:

Non-linear modeling capability

Robustness to feature scaling

Interpretability via feature importance
