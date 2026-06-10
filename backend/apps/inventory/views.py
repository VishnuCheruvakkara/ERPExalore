from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404

from .models import Item, ItemGroup, Shelf, Manufacturer, UnitType, ItemUnit
from .serializers import (
    ItemSerializer,
    ItemDetailSerializer,
    ItemSettingsSerializer,
    ItemUnitSerializer,
    ItemGroupSerializer,
    ShelfSerializer,
    ManufacturerSerializer,
    UnitTypeSerializer,
)


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
    queryset = Item.objects.all().order_by('item_code')
    serializer_class = ItemSerializer


class ItemDetailView(generics.RetrieveAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemDetailSerializer


class ItemUnitCreateView(generics.CreateAPIView):
    queryset = ItemUnit.objects.all()
    serializer_class = ItemUnitSerializer

    def perform_create(self, serializer):
        item = get_object_or_404(Item, pk=self.kwargs.get('pk'))
        serializer.save(item=item)


class ItemSettingsUpdateView(generics.UpdateAPIView):
    queryset = Item.objects.all()
    serializer_class = ItemSettingsSerializer
