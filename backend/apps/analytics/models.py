from django.db import models


class Customer(models.Model):
    customer_id = models.IntegerField(unique=True)
    country = models.CharField(max_length=100, blank=True, null=True)


class Transaction(models.Model):
    invoice_no = models.CharField(max_length=50)
    stock_code = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)

    quantity = models.IntegerField()
    unit_price = models.FloatField()
    total_price = models.FloatField()

    invoice_date = models.DateTimeField()

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)


class CustomerFeatures(models.Model):
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)

    recency = models.IntegerField()
    frequency = models.IntegerField()
    monetary = models.FloatField()
    tenure = models.IntegerField()
    trend = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)


class Prediction(models.Model):
    BUCKET_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("VIP", "VIP"),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    predicted_bucket = models.CharField(max_length=10, choices=BUCKET_CHOICES)

    future_spend = models.FloatField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)