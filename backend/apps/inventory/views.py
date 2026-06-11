from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404

from .models import Item, ItemGroup, Shelf, Manufacturer, UnitType, ItemUnit, ItemPrice
from .serializers import (
    ItemSerializer,
    ItemGroupSerializer,
    ShelfSerializer,
    ManufacturerSerializer,
    UnitTypeSerializer,
    ItemSimpleListSerializer,
    ItemUnitSerializer,
    ItemUnitSettingsUpdateSerializer,
    ItemPriceSerializer
)

#General tab
class InventoryLookupView(APIView):

    def get(self, request, format=None):
        item_groups = ItemGroupSerializer(ItemGroup.objects.order_by('code'), many=True).data
        shelves = ShelfSerializer(Shelf.objects.order_by('code'), many=True).data
        manufacturers = ManufacturerSerializer(Manufacturer.objects.order_by('name'), many=True).data
        unit_types = UnitTypeSerializer(UnitType.objects.order_by('code'), many=True).data

        return Response({
            'item_groups': item_groups,
            'shelves': shelves,
            'manufacturers': manufacturers,
            'unit_types': unit_types,
        })


class ItemListCreateView(generics.ListCreateAPIView):
    """Save data in the Item table"""
    queryset = Item.objects.all().order_by('item_code')
    serializer_class = ItemSerializer

# Unit & Barcode tab 
class ItemSimpleListView(APIView):
    """Load data in the Unicode & bar code tab section"""
    def get(self, request):
        items = ItemSimpleListSerializer(Item.objects.filter(status='active').order_by('item_code'), many=True).data
        unit_types = UnitTypeSerializer(UnitType.objects.order_by('code'), many=True).data

        return Response({
            "items": items,
            "unit_types": unit_types
        })


class ItemUnitCreateView(generics.CreateAPIView):
    """Create Item unit -> request from unitcode & barcoade section"""
    queryset = ItemUnit.objects.all()
    serializer_class = ItemUnitSerializer

class ItemUnitListByItemView(generics.ListAPIView):
    """ Load saved units for a specific item in the Unit & Barcode section"""
    serializer_class = ItemUnitSerializer

    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return ItemUnit.objects.filter(item_id=item_id).order_by('id')


class ItemUnitUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Handle update and delete of units"""
    queryset = ItemUnit.objects.all()
    serializer_class = ItemUnitSerializer

class ItemUnitSettingsUpdateView(generics.UpdateAPIView):
    """Update Item unit settings data for sale_unit and stock_unit"""
    queryset = Item.objects.all()
    serializer_class = ItemUnitSettingsUpdateSerializer
    lookup_field = 'pk'
# Price List Tab
class ItemPriceListByItemView(generics.ListAPIView):
    """Load saved prices for a specific item in the Price List section"""
    serializer_class = ItemPriceSerializer

    def get_queryset(self):
        item_id = self.kwargs.get('item_id')
        return ItemPrice.objects.filter(item_id=item_id).order_by('id')

class ItemPriceCreateView(generics.CreateAPIView):
    """Create Item price"""
    queryset = ItemPrice.objects.all()
    serializer_class = ItemPriceSerializer

class ItemPriceUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """Handle update and delete of prices"""
    queryset = ItemPrice.objects.all()
    serializer_class = ItemPriceSerializer
