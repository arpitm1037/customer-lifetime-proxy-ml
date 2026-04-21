from django.contrib import admin
from .models import Customer, Transaction, CustomerFeatures, Prediction

admin.site.register(Customer)
admin.site.register(Transaction)
admin.site.register(CustomerFeatures)
admin.site.register(Prediction)