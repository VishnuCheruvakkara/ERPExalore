from rest_framework import serializers

from .models import Item, ItemGroup, Shelf, Manufacturer, UnitType, ItemUnit, ItemPrice


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = [
            'id',
            'item_code',
            'name_1',
            'name_2',
            'generic_name',
            'description',
            'behaviour',
            'group_code',
            'taxable_status',
            'shelf_code',
            'manufacturer',
            'photo_url',
            'sales_unit',
            'stock_unit',
        ]

class ItemGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemGroup
        fields = ['id', 'code', 'name']


class ShelfSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelf
        fields = ['id', 'code', 'description']


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = ['id', 'name']

class UnitTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnitType
        fields = ['id', 'code', 'name']

class ItemUnitSerializer(serializers.ModelSerializer):
    unit_detail = UnitTypeSerializer(source='unit', read_only=True)

    class Meta:
        model = ItemUnit
        fields = ['id', 'item', 'unit', 'unit_detail', 'cofactor', 'barcode']

class ItemSimpleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['id','item_code','name_1','sales_unit','stock_unit']

class ItemUnitSettingsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['sales_unit', 'stock_unit']

class ItemPriceSerializer(serializers.ModelSerializer):
    unit_detail = UnitTypeSerializer(source='unit', read_only=True)

    class Meta:
        model = ItemPrice
        fields = [
            'id', 
            'item', 
            'price_list_type', 
            'unit', 
            'unit_detail', 
            'sale_price', 
            'minimum_selling_price'
        ]