from django.db import models

# Create your models here.

# LOOKUP / REFERENCE TABLES
class ItemGroup(models.Model):
    """Maps to 'Group Code' dropdown on General Tab"""
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.name}"


class Shelf(models.Model):
    """Maps to 'Shelf Code' dropdown on General Tab"""
    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return self.code


class Manufacturer(models.Model):
    """Maps to 'Manufacturer' dropdown on General Tab"""
    name = models.CharField(max_length=150, unique=True)

    def __str__(self):
        return self.name


class UnitType(models.Model):
    """
    Global units registry (e.g., CTNS, Ltr, Pcs).
    Populates dropdowns in Unit Management & Unit Settings.
    """
    code = models.CharField(max_length=20, unique=True)  # e.g., 'CTNS'
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.code


#  CORE ITEM MODEL 
class Item(models.Model):
    BEHAVIOUR_CHOICES = [
        ('purchase_item', 'Purchase Item'),
        ('sales_item', 'Sales Item'),
        ('inventory_item', 'Inventory Item'),
    ]
    
    # 'draft' as the default state for step-by-step workflow.
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    TAXABLE_CHOICES = [
        ('taxable', 'Taxable'),
        ('non_taxable', 'Non-Taxable'),
    ]

    # --- Basic Information ---
    item_code = models.CharField(max_length=100, unique=True)
    name_1 = models.CharField(max_length=255)  # Required field (Name 1 **)
    name_2 = models.CharField(max_length=255, blank=True, null=True)

    # --- Additional Information ---
    generic_name = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    # --- Configuration ---
    behaviour = models.CharField(max_length=50, choices=BEHAVIOUR_CHOICES, default='purchase_item')
    group_code = models.ForeignKey(ItemGroup, on_delete=models.PROTECT)  # Required Field (Group Code **)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    taxable_status = models.CharField(max_length=20, choices=TAXABLE_CHOICES, default='non_taxable')
    shelf_code = models.ForeignKey(Shelf, on_delete=models.SET_NULL, blank=True, null=True)
    manufacturer = models.ForeignKey(Manufacturer, on_delete=models.SET_NULL, blank=True, null=True)

    # Stores the Cloudinary secure target image URL string securely
    photo_url = models.URLField(max_length=500, blank=True, null=True)

    # --- Unit Settings Framework ---
    sales_unit = models.ForeignKey(
        UnitType, on_delete=models.PROTECT, related_name='item_sales_defaults', blank=True, null=True
    )
    stock_unit = models.ForeignKey(
        UnitType, on_delete=models.PROTECT, related_name='item_stock_defaults', blank=True, null=True
    )

    class Meta:
        verbose_name = "Item"
        verbose_name_plural = "Items"

    def __str__(self):
        return f"{self.item_code} - {self.name_1} [{self.get_status_display()}]"


# COMPLEMENTARY SUB-MODELS
class ItemUnit(models.Model):
    """
    Unit & Barcode Tab 
    """
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='units')
    unit = models.ForeignKey(UnitType, on_delete=models.PROTECT)
    cofactor = models.DecimalField(max_digits=10, decimal_places=4, default=1.0000)
    barcode = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        # Prevents assigning the same unit configuration to an item twice
        unique_together = ('item', 'unit')
        verbose_name = "Item Unit"
        verbose_name_plural = "Item Units"

    def __str__(self):
        return f"{self.item.item_code} Unit: {self.unit.code} (x{self.cofactor})"


class ItemPrice(models.Model):
    """
    Price List Tab grid entries.
    Populates dynamic target grid prices tracking back to an existing item row.
    """
    PRICE_TYPE_CHOICES = [
        ('RETAIL', 'Retail'),
        ('WHOLESALE', 'Wholesale'),
    ]

    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name='prices')
    price_list_type = models.CharField(max_length=50, choices=PRICE_TYPE_CHOICES, default='RETAIL')
    unit = models.ForeignKey(UnitType, on_delete=models.PROTECT)
    sale_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    minimum_selling_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('item', 'price_list_type', 'unit')
        verbose_name = "Item Price"
        verbose_name_plural = "Item Prices"

    def __str__(self):
        return f"{self.item.name_1} ({self.unit.code}) - {self.price_list_type}: {self.sale_price}"