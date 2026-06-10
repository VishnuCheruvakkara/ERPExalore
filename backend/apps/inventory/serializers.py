from rest_framework import serializers

from .models import Item, ItemGroup, Shelf, Manufacturer, UnitType, ItemUnit


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
        extra_kwargs = {
            'group_code': {'required': True},
            'item_code': {'required': True},
            'name_1': {'required': True},
        }


class ItemUnitSerializer(serializers.ModelSerializer):
    unit = serializers.PrimaryKeyRelatedField(queryset=UnitType.objects.all(), write_only=True)
    unit_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = ItemUnit
        fields = ['id', 'item', 'unit', 'unit_detail', 'cofactor', 'barcode']
        read_only_fields = ['id', 'item']

    def get_unit_detail(self, obj):
        return {
            'id': obj.unit.id,
            'code': obj.unit.code,
            'name': obj.unit.name,
        }


class ItemDetailSerializer(ItemSerializer):
    units = ItemUnitSerializer(many=True, read_only=True)

    class Meta(ItemSerializer.Meta):
        fields = ItemSerializer.Meta.fields + ['units']


class ItemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ['sales_unit', 'stock_unit']


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
