from rest_framework import serializers
from .models import Customer, SalesExecutive, QuotationType, OrderType, Currency, SalesQuotation, SalesOrder, SalesLineItem
from inventory.models import Item, UnitType

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'code', 'name']

class SalesExecutiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesExecutive
        fields = ['id', 'name']

class QuotationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotationType
        fields = ['id', 'name']

class OrderTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderType
        fields = ['id', 'name']

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Currency
        fields = ['id', 'code']

class SalesLineItemSerializer(serializers.ModelSerializer):
    item_id = serializers.IntegerField()
    unit_id = serializers.IntegerField()

    class Meta:
        model = SalesLineItem
        fields = [
            'id', 'item_id', 'description', 'unit_id', 
            'qty', 'rate', 'disc_pct', 'disc_amt', 
            'net_amount', 'vat_amount', 'net_after_vat'
        ]

class SalesQuotationSerializer(serializers.ModelSerializer):
    items = SalesLineItemSerializer(many=True)
    customer_id = serializers.IntegerField()
    sales_executive_id = serializers.IntegerField(required=False, allow_null=True)
    currency_id = serializers.IntegerField()
    quotation_type_id = serializers.IntegerField()

    class Meta:
        model = SalesQuotation
        fields = [
            'id', 'quotation_no', 'quotation_type_id', 'date',
            'customer_id', 'sales_executive_id', 'currency_id', 'ex_rate',
            'cust_ref_num', 'attention', 'pay_terms', 'delivery_place', 'notes',
            'gross_total', 'vat_total', 'net_after_vat', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        quotation = SalesQuotation.objects.create(**validated_data)
        
        for item_data in items_data:
            SalesLineItem.objects.create(quotation=quotation,item_id=item_data.pop("item_id"),unit_id=item_data.pop("unit_id"), **item_data)
            
        return quotation

class SalesOrderSerializer(serializers.ModelSerializer):
    items = SalesLineItemSerializer(many=True)
    customer_id = serializers.IntegerField()
    sales_executive_id = serializers.IntegerField(required=False, allow_null=True)
    currency_id = serializers.IntegerField()
    order_type_id = serializers.IntegerField()
    quotation_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = SalesOrder
        fields = [
            'id', 'so_no', 'order_type_id', 'date', 'valid_until', 'customer_po', 'quotation_id',
            'customer_id', 'sales_executive_id', 'currency_id', 'ex_rate','delivery_place', 'notes',
            'gross_total', 'vat_total', 'net_after_vat', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = SalesOrder.objects.create(**validated_data)
        for item_data in items_data:
            SalesLineItem.objects.create(order=order,item_id=item_data.pop("item_id"),unit_id=item_data.pop("unit_id"), **item_data)
        return order
