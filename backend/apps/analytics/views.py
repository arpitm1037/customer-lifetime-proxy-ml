import threading

from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import pandas as pd

from apps.analytics.models import Transaction, Customer, CustomerFeatures, Prediction, AnalysisHistory
from ml.model_loader import load_model

import json
from django.contrib.auth.models import User

REQUIRED_COLUMNS = {"CustomerID", "InvoiceNo", "Quantity", "UnitPrice", "InvoiceDate", "TotalAmount"}


_ANALYTICS_WRITE_LOCK = threading.Lock()

REJECTED_UPLOAD_CONTENT_TYPES = frozenset({
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/zip",
    "application/x-zip-compressed",
})



# 1. UPLOAD CSV
@api_view(["POST"])
def upload_data(request):
    file = request.FILES.get("file")

    if not file:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    name = (file.name or "").lower()
    if not name.endswith(".csv"):
        return Response(
            {"error": "Only CSV files are allowed"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ct = (getattr(file, "content_type", None) or "").split(";")[0].strip().lower()
    if ct in REJECTED_UPLOAD_CONTENT_TYPES:
        return Response(
            {"error": f"Unsupported file type ({ct}). Upload a CSV file."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        df = pd.read_csv(file, encoding="ISO-8859-1")
    except Exception:
        return Response(
            {"error": "Could not parse file as CSV"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if df.empty:
        return Response({"error": "CSV file is empty"}, status=status.HTTP_400_BAD_REQUEST)

    
    df.columns = [str(c).strip() for c in df.columns]

    # Normalize header casing so existing datasets keep working.
    canonical_by_lower = {col.lower(): col for col in REQUIRED_COLUMNS}
    rename_map = {}
    for col in df.columns:
        normalized = col.strip().lower()
        if normalized in canonical_by_lower:
            rename_map[col] = canonical_by_lower[normalized]
    if rename_map:
        df = df.rename(columns=rename_map)

    # Backward compatibility: derive TotalAmount when older datasets omit it.
    if "TotalAmount" not in df.columns and "Quantity" in df.columns and "UnitPrice" in df.columns:
        try:
            df["TotalAmount"] = pd.to_numeric(df["Quantity"], errors="coerce") * pd.to_numeric(df["UnitPrice"], errors="coerce")
        except Exception:
            pass

    missing_cols = REQUIRED_COLUMNS - set(df.columns)
    if missing_cols:
        return Response(
            {
                "error": "Missing required columns",
                "required": sorted(REQUIRED_COLUMNS),
                "found": list(df.columns)
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    if len(df) > 30000:
        df = df.sample(n=30000, random_state=42)

    # Keep internal processing strictly scoped to required columns only.
    df = df[["CustomerID", "InvoiceDate", "InvoiceNo", "Quantity", "UnitPrice", "TotalAmount"]].copy()

    df = df.dropna(subset=["CustomerID", "InvoiceNo", "Quantity", "UnitPrice", "InvoiceDate", "TotalAmount"])

    
    df["CustomerID"] = df["CustomerID"].astype(int)
    df["Quantity"] = df["Quantity"].astype(int)
    df["UnitPrice"] = df["UnitPrice"].astype(float)
    df["total_price"] = df["TotalAmount"].astype(float)

    df["invoice_date"] = pd.to_datetime(df["InvoiceDate"], errors="coerce", utc=True)
    df = df.dropna(subset=["invoice_date"])

    df["stock_code"] = "-"
    df["description"] = None
    df["country"] = None

    customers = (
    df.groupby("CustomerID")["country"]
    .first()
    .reset_index()
    .rename(columns={"CustomerID": "customer_id"})
)

    with _ANALYTICS_WRITE_LOCK:
        with transaction.atomic():

            Customer.objects.all().delete()

           
            Customer.objects.bulk_create(
                [
                    Customer(customer_id=row["customer_id"], country=row["country"])
                    for _, row in customers.iterrows()
                ]
            )

            pk_by_retail = dict(
                Customer.objects.values_list("customer_id", "id")
            )

           
            transactions = [
                Transaction(
                    customer_id=pk_by_retail[row["CustomerID"]],
                    invoice_no=str(row["InvoiceNo"])[:50],
                    stock_code=row["stock_code"],
                    description=row["description"],
                    quantity=row["Quantity"],
                    unit_price=row["UnitPrice"],
                    total_price=row["total_price"],
                    invoice_date=row["invoice_date"],
                )
                for _, row in df.iterrows()
            ]

            
            Transaction.objects.bulk_create(transactions, batch_size=1000)

    return Response({"message": "Data uploaded successfully"})



# 2. FEATURE GENERATION

@api_view(["POST"])
def generate_features(request):

    with _ANALYTICS_WRITE_LOCK:
        CustomerFeatures.objects.all().delete()

        df = pd.DataFrame(list(Transaction.objects.values()))
        if df.empty:
            return Response(
                {"error": "No transactions found to generate features."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        df["invoice_date"] = pd.to_datetime(df["invoice_date"])
        df["total_price"] = df["quantity"] * df["unit_price"]
  
        snapshot_date = df["invoice_date"].max() + pd.Timedelta(days=1)

        rfm = df.groupby("customer_id").agg({
            "invoice_date": [
                lambda x: (snapshot_date - x.max()).days,
                "count"
            ],
            "total_price": "sum"
        })

        rfm.columns = ["Recency", "Frequency", "Monetary"]
        rfm = rfm.reset_index()

        first_purchase = df.groupby("customer_id")["invoice_date"].min()

        
        rfm["Tenure"] = rfm["customer_id"].apply(
            lambda cid: (snapshot_date - first_purchase.get(cid, snapshot_date)).days
        )

        monthly = (
            df.set_index("invoice_date")
            .groupby("customer_id")["total_price"]
            .resample("ME")
            .sum()
            .reset_index()
        )

       
        trend = monthly.groupby("customer_id")["total_price"].apply(
            lambda x: x.diff().mean() if len(x) > 1 else 0
        )

        rfm["Trend"] = rfm["customer_id"].map(trend).fillna(0)

        objs = []
        for _, row in rfm.iterrows():
            objs.append(
                CustomerFeatures(
                    customer_id=row["customer_id"],
                    recency=int(row["Recency"]),
                    frequency=int(row["Frequency"]),
                    monetary=float(row["Monetary"]),
                    tenure=int(row["Tenure"]),
                    trend=float(row["Trend"]),
                )
            )

        CustomerFeatures.objects.bulk_create(objs)

    return Response({"message": "Features generated"})


# 3. PREDICTION
@api_view(["POST"])
def predict(request):

    with _ANALYTICS_WRITE_LOCK:
        Prediction.objects.all().delete()

        df = pd.DataFrame(list(CustomerFeatures.objects.values()))

        if df.empty:
            return Response(
                {"error": "No features found to predict from."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        model = load_model()

        
        required_cols = ["recency", "frequency", "monetary", "tenure", "trend"]

        missing = [col for col in required_cols if col not in df.columns]
        if missing:
            return Response(
                {"error": f"Missing columns: {missing}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        
        X = df[required_cols].rename(columns={
            "recency": "Recency",
            "frequency": "Frequency",
            "monetary": "Monetary",
            "tenure": "Tenure",
            "trend": "Trend"
        }).astype(float)

        preds = model.predict(X)

        objs = [
            Prediction(
                customer_id=customer_id,
                predicted_bucket=str(pred),
            )
            for customer_id, pred in zip(df["customer_id"].tolist(), preds)
        ]

        Prediction.objects.bulk_create(objs)

    return Response({"message": "Prediction done"})


# 4. GET RESULTS

@api_view(["GET"])
def get_predictions(request):

    preds = Prediction.objects.select_related("customer").all()

    features_map = {
        f.customer_id: f for f in CustomerFeatures.objects.all()
    }

    data = []

    for p in preds:
        cid = p.customer.customer_id  

        feat = features_map.get(p.customer_id)

        data.append({
            "customer_id": cid,   
            "predicted_bucket": p.predicted_bucket,
            "recency": feat.recency if feat else 0,
            "frequency": feat.frequency if feat else 0,
            "monetary": feat.monetary if feat else 0,
            "tenure": feat.tenure if feat else 0,
            "trend": feat.trend if feat else 0,
        })

    return Response(data)

# 5. COHORT ANALYSIS

@api_view(["GET"])
def get_cohorts(request):
    df = pd.DataFrame(list(Transaction.objects.values()))

    if df.empty:
        return Response([])

    df["invoice_date"] = pd.to_datetime(df["invoice_date"])

    
    df["invoice_month"] = df["invoice_date"].dt.tz_localize(None).dt.to_period("M").astype(str)

   
    cohort = df.groupby("customer_id")["invoice_month"].min().reset_index()
    cohort.columns = ["customer_id", "cohort_month"]

    df = pd.merge(df, cohort, on="customer_id")

    result = []

    cohort_groups = df.groupby("cohort_month")["customer_id"].unique()

    for cohort_month, customers in cohort_groups.items():

        total_customers = len(customers)
        returning_customers = 0

        for cid in customers:
            user_data = df[df["customer_id"] == cid]

            user_cohort = user_data["cohort_month"].iloc[0]

            
            future_tx = user_data[user_data["invoice_month"] > user_cohort]

            if len(future_tx) > 0:
                returning_customers += 1

        retention = 0
        if total_customers > 0:
            retention = round((returning_customers / total_customers) * 100)

        result.append({
            "cohort_month": cohort_month,
            "total_customers": total_customers,
            "returning_customers": returning_customers,
            "retention_rate": retention
        })

    result = sorted(result, key=lambda x: x["cohort_month"], reverse=True)

    return Response(result)

# 6. CUSTOMER DETAIL

@api_view(["GET"])
def get_customer_detail(request, customer_id):
    try:
        customer = Customer.objects.filter(customer_id=customer_id).first()

        if not customer:
            return Response({"error": "Customer not found"}, status=404)

        features = CustomerFeatures.objects.filter(customer=customer).first()

        if not features:
            return Response({"error": "Customer data incomplete"}, status=404)

        prediction_obj = Prediction.objects.filter(customer=customer).last()
        prediction = prediction_obj.predicted_bucket if prediction_obj else "Unknown"

        return Response({
            "customer_id": customer.customer_id,
            "segment": prediction,
            "recency": features.recency,
            "frequency": features.frequency,
            "monetary": features.monetary,
            "tenure": features.tenure,
            "trend": features.trend,
        })

    except Exception as e:
        return Response({"error": str(e)}, status=500)


@api_view(["POST"])
def save_history(request):
    try:
        user_email = request.data.get("email")
        if not user_email:
            return Response({"error": "Email is required"}, status=400)
            
        user = User.objects.filter(email=user_email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
            
        filename = request.data.get("filename", "Dataset")
        result_data = request.data.get("metrics_json", {})
        
        AnalysisHistory.objects.create(
            user=user,
            uploaded_file_name=filename,
            result_data=result_data
        )
        return Response({"message": "History saved"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def get_history(request):
    try:
        user_email = request.GET.get("email")
        if not user_email:
            return Response({"error": "Email is required"}, status=400)
            
        user = User.objects.filter(email=user_email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)
            
        histories = AnalysisHistory.objects.filter(user=user).order_by("-created_at")
        data = []
        for h in histories:
            result_data = h.result_data if isinstance(h.result_data, dict) else {}
            analysis_rows = result_data.get("data", []) if isinstance(result_data.get("data", []), list) else []
            segment_counts = {}
            for row in analysis_rows:
                if not isinstance(row, dict):
                    continue
                bucket = row.get("predicted_bucket")
                if bucket:
                    segment_counts[bucket] = segment_counts.get(bucket, 0) + 1

            top_segment = None
            if segment_counts:
                top_segment = max(segment_counts, key=segment_counts.get)

            data.append({
                "id": h.id,
                "filename": h.uploaded_file_name,
                "created_at": h.created_at,
                "summary": {
                    "total_customers": len(analysis_rows),
                    "top_segment": top_segment,
                }
            })
        return Response(data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["GET"])
def get_history_detail(request, history_id):
    try:
        user_email = request.GET.get("email")
        history_qs = AnalysisHistory.objects.filter(id=history_id)
        if user_email:
            user = User.objects.filter(email=user_email).first()
            if not user:
                return Response({"error": "User not found"}, status=404)
            history_qs = history_qs.filter(user=user)

        history = history_qs.first()
        if not history:
            return Response({"error": "History not found"}, status=404)
            
        return Response({
            "id": history.id,
            "filename": history.uploaded_file_name,
            "created_at": history.created_at,
            "metrics_json": history.result_data
        })
    except Exception as e:
        return Response({"error": str(e)}, status=500)