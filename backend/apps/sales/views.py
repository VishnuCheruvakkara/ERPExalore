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

# Sales quotation handling 
class SalesQuotationLookupView(APIView):
    """
    Returns all dropdown data needed to fill the Sales Quotation form.
    """
    def get(self, request, format=None):

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

# Sales order handling 
class SalesOrderLookupView(APIView):
    """
    Returns all dropdown data needed to fill the Sales Order form.
    """
    def get(self, request, format=None):
       
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
