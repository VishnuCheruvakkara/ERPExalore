from django.urls import path

from .views import (
    InventoryLookupView,
    ItemListCreateView,
    ItemDetailView,
    ItemUnitCreateView,
    ItemSettingsUpdateView,
)

urlpatterns = [
    path('lookups/', InventoryLookupView.as_view(), name='inventory-lookups'),
    path('items/', ItemListCreateView.as_view(), name='inventory-items'),
    path('items/<int:pk>/', ItemDetailView.as_view(), name='inventory-item-detail'),
    path('items/<int:pk>/units/', ItemUnitCreateView.as_view(), name='inventory-item-units'),
    path('items/<int:pk>/settings/', ItemSettingsUpdateView.as_view(), name='inventory-item-settings'),
]
