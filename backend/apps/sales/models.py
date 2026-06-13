from django.db import models

# Create your models here.

class Customer(models.Model):
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=255)
    def __str__(self): return f"{self.code} - {self.name}"

class SalesExecutive(models.Model):
    name = models.CharField(max_length=150)
    def __str__(self): return self.name

class QuotationType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class OrderType(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self): return self.name

class Currency(models.Model):
    code = models.CharField(max_length=50, unique=True)
    def __str__(self): return self.code

class AbstractSalesDocument(models.Model):
    """
    'This template holds all fields that appear at the top of BOTH 
    the Quotation and Sales Order screens.'
    """
    date = models.DateField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    sales_executive = models.ForeignKey(SalesExecutive, on_delete=models.SET_NULL, null=True)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT)
    ex_rate = models.DecimalField(max_digits=10, decimal_places=4, default=1.0000)
    
    # Extra fields
    cust_ref_num = models.CharField(max_length=40, blank=True)
    attention = models.CharField(max_length=255, blank=True)
    pay_terms = models.CharField(max_length=255, blank=True)
    delivery_place = models.CharField(max_length=255, blank=True)
    notes = models.TextField(blank=True)
    
    # Financial Headers
    gross_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    vat_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    net_after_vat = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    class Meta:
        abstract = True

class SalesQuotation(AbstractSalesDocument):
    """
    'Represents the main Quotation document. It stores the header 
    information and inherits common fields like Date and Customer from 
    AbstractSalesDocument.'
    """
    quotation_no = models.CharField(max_length=50, unique=True)
    quotation_type = models.ForeignKey(QuotationType, on_delete=models.PROTECT)

    def __str__(self): return f"Quote: {self.quotation_no}"

class SalesOrder(AbstractSalesDocument):
    """
    'Represents the confirmed Sales Order. It links to a Quotation 
    (if one exists) and includes the customer PO number for tracking.'
    """
    so_no = models.CharField(max_length=50, unique=True)
    order_type = models.ForeignKey(OrderType, on_delete=models.PROTECT)
    customer_po = models.CharField(max_length=100, blank=True)
    quotation = models.ForeignKey(SalesQuotation, on_delete=models.SET_NULL, null=True, blank=True)
    valid_until = models.DateField(blank=True, null=True) # Matches your UI

    def __str__(self): return f"Order: {self.so_no}"

class SalesLineItem(models.Model):
    """
    'Acts as the individual rows in the UI grid. Each record is a product line, 
    linked to either a Quotation or an Order, containing quantity, price, 
    and tax calculations for that specific row.'
    """
    quotation = models.ForeignKey(SalesQuotation, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    order = models.ForeignKey(SalesOrder, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    
    item = models.ForeignKey('inventory.Item', on_delete=models.PROTECT)
    description = models.CharField(max_length=255) # Added as per your UI grid
    unit = models.ForeignKey('inventory.UnitType', on_delete=models.PROTECT)
    qty = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    
    # Discount fields from your UI
    disc_pct = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    disc_amt = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Totals
    net_amount = models.DecimalField(max_digits=15, decimal_places=2)
    vat_amount = models.DecimalField(max_digits=15, decimal_places=2)
    net_after_vat = models.DecimalField(max_digits=15, decimal_places=2)
    
    def __str__(self): return f"Item: {self.item.name_1} (Qty: {self.qty})"