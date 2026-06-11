from django.urls import path

from .views import (
    InventoryLookupView,
    ItemListCreateView,
    ItemSimpleListView,
    ItemUnitCreateView,
    ItemUnitListByItemView,
    ItemUnitUpdateDestroyView,
    ItemUnitSettingsUpdateView
)

urlpatterns = [
    # General tab
    path('lookups/', InventoryLookupView.as_view(), name='inventory-lookups'),
    path('items/', ItemListCreateView.as_view(), name='inventory-items'),
    # Unit and barcode tab
    path('items/simple/', ItemSimpleListView.as_view(), name='item-simple-list'),
    path('items/<int:item_id>/units/', ItemUnitListByItemView.as_view(), name='inventory-item-units'),
    path('units/', ItemUnitCreateView.as_view(), name='inventory-units'),
    path('units/<int:pk>/', ItemUnitUpdateDestroyView.as_view(), name='inventory-unit-detail'),
    path('items/<int:pk>/unit-settings/', ItemUnitSettingsUpdateView.as_view(), name='item-unit-settings-update'),
]
