from django.urls import path
from .views import upload_data, generate_features, predict, get_predictions, get_cohorts, get_customer_detail, save_history, get_history, get_history_detail
from .auth_views import signup, login_view

urlpatterns = [
    path('upload/', upload_data),
    path('features/', generate_features),
    path('predict/', predict),
    path('predictions/', get_predictions),
    path('cohorts/', get_cohorts),
    path('customer/<int:customer_id>/', get_customer_detail),
    path('auth/signup/', signup),
    path('auth/login/', login_view),
    path('history/save/', save_history),
    path('history/list/', get_history),
    path('history/detail/<int:history_id>/', get_history_detail),
]