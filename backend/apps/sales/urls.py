from django.urls import path
from .views import (
    SalesQuotationLookupView, SalesQuotationNextNumberView, SalesQuotationCreateView,
    SalesOrderLookupView, SalesOrderNextNumberView, SalesOrderCreateView,
    SalesQuotationDetailView, SalesOrderDetailView
)

urlpatterns = [
    path('lookups/', SalesQuotationLookupView.as_view(), name='sales-quotation-lookups'),
    path('quotations/next-number/', SalesQuotationNextNumberView.as_view(), name='sales-quotation-next-number'),
    path('quotations/', SalesQuotationCreateView.as_view(), name='sales-quotation-create'),
    path('quotations/<int:pk>/', SalesQuotationDetailView.as_view(), name='sales-quotation-detail'),
    path('orders/lookups/', SalesOrderLookupView.as_view(), name='sales-order-lookups'),
    path('orders/next-number/', SalesOrderNextNumberView.as_view(), name='sales-order-next-number'),
    path('orders/', SalesOrderCreateView.as_view(), name='sales-order-create'),
    path('orders/<int:pk>/', SalesOrderDetailView.as_view(), name='sales-order-detail'),
]
