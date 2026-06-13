from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics

from .models import Customer, SalesExecutive, QuotationType, OrderType, Currency, SalesQuotation, SalesOrder
from .serializers import (
    CustomerSerializer,
    SalesExecutiveSerializer,
    QuotationTypeSerializer,
    OrderTypeSerializer,
    CurrencySerializer,
    SalesQuotationSerializer,
    SalesOrderSerializer
)
from inventory.models import Item, UnitType, ItemGroup
from inventory.serializers import UnitTypeSerializer, ItemSimpleListSerializer


class SalesQuotationLookupView(APIView):
    """
    Returns all dropdown data needed to fill the Sales Quotation form.
    Seeds initial records if tables are empty (dev convenience).
    """
    def get(self, request, format=None):
        # Seed lookup tables when empty
        if not Customer.objects.exists():
            Customer.objects.create(code='CUST-001', name='Saudi Trading Co.')
            Customer.objects.create(code='CUST-002', name='Gulf Logistics Ltd.')
            Customer.objects.create(code='CUST-003', name='Riyadh Enterprise')

        if not SalesExecutive.objects.exists():
            SalesExecutive.objects.create(name='John Doe')
            SalesExecutive.objects.create(name='Sarah Smith')
            SalesExecutive.objects.create(name='Mohammed Ali')

        if not QuotationType.objects.exists():
            QuotationType.objects.create(name='Standard Quotation')
            QuotationType.objects.create(name='Urgent Quotation')

        if not Currency.objects.exists():
            Currency.objects.create(code='1 - SAUDI RIYAL')
            Currency.objects.create(code='2 - US DOLLAR')
            Currency.objects.create(code='3 - UAE DIRHAM')

        if not UnitType.objects.exists():
            UnitType.objects.create(code='PCS', name='Pieces')
            UnitType.objects.create(code='BOX', name='Box')
            UnitType.objects.create(code='KG', name='Kilograms')

        if not Item.objects.exists():
            group, _ = ItemGroup.objects.get_or_create(code='GRP01', defaults={'name': 'General Items'})
            unit = UnitType.objects.first()
            Item.objects.create(
                item_code='ITEM001',
                name_1='Wireless Mouse',
                description='High-precision wireless optical mouse',
                group_code=group, sales_unit=unit, stock_unit=unit,
                status='active', taxable_status='taxable'
            )
            Item.objects.create(
                item_code='ITEM002',
                name_1='Mechanical Keyboard',
                description='RGB mechanical keyboard with red switches',
                group_code=group, sales_unit=unit, stock_unit=unit,
                status='active', taxable_status='taxable'
            )

        return Response({
            'customers': CustomerSerializer(Customer.objects.all().order_by('code'), many=True).data,
            'sales_executives': SalesExecutiveSerializer(SalesExecutive.objects.all().order_by('name'), many=True).data,
            'quotation_types': QuotationTypeSerializer(QuotationType.objects.all().order_by('name'), many=True).data,
            'currencies': CurrencySerializer(Currency.objects.all().order_by('code'), many=True).data,
            'items': ItemSimpleListSerializer(Item.objects.filter(status='active').order_by('item_code'), many=True).data,
            'unit_types': UnitTypeSerializer(UnitType.objects.all().order_by('code'), many=True).data,
        })


class SalesQuotationNextNumberView(APIView):
    """Returns the next available quotation number based on current year and count."""
    def get(self, request, format=None):
        from django.utils import timezone
        year = timezone.now().year
        prefix = f'SQ-{year}-'
        last = SalesQuotation.objects.filter(quotation_no__startswith=prefix).order_by('-quotation_no').first()
        if last:
            try:
                seq = int(last.quotation_no.split('-')[-1]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return Response({'quotation_no': f'{prefix}{str(seq).zfill(4)}'})


class SalesQuotationCreateView(generics.CreateAPIView):
    """Saves a new Sales Quotation with its nested line items."""
    queryset = SalesQuotation.objects.all()
    serializer_class = SalesQuotationSerializer


class SalesOrderLookupView(APIView):
    """
    Returns all dropdown data needed to fill the Sales Order form.
    Seeds initial records if tables are empty (dev convenience).
    """
    def get(self, request, format=None):
        # Seed OrderType lookup table when empty
        if not OrderType.objects.exists():
            OrderType.objects.create(name='Standard Order')
            OrderType.objects.create(name='Backorder')

        # Reuse same seeding check as SalesQuotationLookupView for other tables if empty
        if not Customer.objects.exists():
            Customer.objects.create(code='CUST-001', name='Saudi Trading Co.')
            Customer.objects.create(code='CUST-002', name='Gulf Logistics Ltd.')
            Customer.objects.create(code='CUST-003', name='Riyadh Enterprise')

        if not SalesExecutive.objects.exists():
            SalesExecutive.objects.create(name='John Doe')
            SalesExecutive.objects.create(name='Sarah Smith')
            SalesExecutive.objects.create(name='Mohammed Ali')

        if not Currency.objects.exists():
            Currency.objects.create(code='1 - SAUDI RIYAL')
            Currency.objects.create(code='2 - US DOLLAR')
            Currency.objects.create(code='3 - UAE DIRHAM')

        if not UnitType.objects.exists():
            UnitType.objects.create(code='PCS', name='Pieces')
            UnitType.objects.create(code='BOX', name='Box')
            UnitType.objects.create(code='KG', name='Kilograms')

        if not Item.objects.exists():
            group, _ = ItemGroup.objects.get_or_create(code='GRP01', defaults={'name': 'General Items'})
            unit = UnitType.objects.first()
            Item.objects.create(
                item_code='ITEM001',
                name_1='Wireless Mouse',
                description='High-precision wireless optical mouse',
                group_code=group, sales_unit=unit, stock_unit=unit,
                status='active', taxable_status='taxable'
            )
            Item.objects.create(
                item_code='ITEM002',
                name_1='Mechanical Keyboard',
                description='RGB mechanical keyboard with red switches',
                group_code=group, sales_unit=unit, stock_unit=unit,
                status='active', taxable_status='taxable'
            )

        quotations = SalesQuotation.objects.all().order_by('-date')

        return Response({
            'customers': CustomerSerializer(Customer.objects.all().order_by('code'), many=True).data,
            'sales_executives': SalesExecutiveSerializer(SalesExecutive.objects.all().order_by('name'), many=True).data,
            'order_types': OrderTypeSerializer(OrderType.objects.all().order_by('name'), many=True).data,
            'currencies': CurrencySerializer(Currency.objects.all().order_by('code'), many=True).data,
            'items': ItemSimpleListSerializer(Item.objects.filter(status='active').order_by('item_code'), many=True).data,
            'unit_types': UnitTypeSerializer(UnitType.objects.all().order_by('code'), many=True).data,
            'quotations': [{'id': q.id, 'quotation_no': q.quotation_no} for q in quotations],
        })


class SalesOrderNextNumberView(APIView):
    """Returns the next available sales order number based on current year and count."""
    def get(self, request, format=None):
        from django.utils import timezone
        year = timezone.now().year
        prefix = f'SO-{year}-'
        last = SalesOrder.objects.filter(so_no__startswith=prefix).order_by('-so_no').first()
        if last:
            try:
                seq = int(last.so_no.split('-')[-1]) + 1
            except (ValueError, IndexError):
                seq = 1
        else:
            seq = 1
        return Response({'so_no': f'{prefix}{str(seq).zfill(4)}'})


class SalesOrderCreateView(generics.CreateAPIView):
    """Saves a new Sales Order with its nested line items."""
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer


class SalesQuotationDetailView(generics.RetrieveAPIView):
    """Retrieves a single Sales Quotation with its details and line items."""
    queryset = SalesQuotation.objects.all()
    serializer_class = SalesQuotationSerializer


class SalesOrderDetailView(generics.RetrieveAPIView):
    """Retrieves a single Sales Order with its details and line items."""
    queryset = SalesOrder.objects.all()
    serializer_class = SalesOrderSerializer
