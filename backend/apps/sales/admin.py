from django.contrib import admin
from .models import (
    Customer, SalesExecutive, QuotationType, OrderType, Currency,
    SalesQuotation, SalesOrder, SalesLineItem
)

# This registers every model with the default settings
admin.site.register(Customer)
admin.site.register(SalesExecutive)
admin.site.register(QuotationType)
admin.site.register(OrderType)
admin.site.register(Currency)
admin.site.register(SalesQuotation)
admin.site.register(SalesOrder)
admin.site.register(SalesLineItem)