from rest_framework import generics,status
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
    ItemPriceSerializer,
    ItemPhotoUploadSerializer
)

from apps.common.cloudinary_service import CloudinaryService

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

# Handle Image upload
class ItemPhotoUploadView(APIView):

    def post(self, request):
        try:
            serializer = ItemPhotoUploadSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            item = Item.objects.get(
                pk=serializer.validated_data['item_id']
            )

            image_url = CloudinaryService.upload_image(
                serializer.validated_data['image']
            )

            item.photo_url = image_url
            item.save(update_fields=['photo_url'])

            return Response(
                {
                    'message': 'Image uploaded successfully',
                    'photo_url': image_url
                },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print("ERROR in ItemPhotoUploadView:", str(e))
            import traceback
            traceback.print_exc()
            return Response(
                {
                    'detail': f'Failed to upload image: {str(e)}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request):
        try:
            item_id = request.data.get('item_id')
            if not item_id:
                return Response(
                    {'detail': 'item_id is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            item = Item.objects.get(pk=item_id)
            item.photo_url = None
            item.save(update_fields=['photo_url'])

            return Response(
                {'message': 'Image deleted successfully'},
                status=status.HTTP_200_OK
            )
        except Item.DoesNotExist:
            return Response(
                {'detail': 'Item not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print("ERROR in ItemPhotoUploadView (delete):", str(e))
            return Response(
                {
                    'detail': f'Failed to delete image: {str(e)}'
                },
                status=status.HTTP_400_BAD_REQUEST
            )