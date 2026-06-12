from django.contrib import admin
from .models import (
    ItemGroup,
    Shelf,
    Manufacturer,
    UnitType,
    Item,
    ItemUnit,
    ItemPrice,
)

admin.site.register(ItemGroup)
admin.site.register(Shelf)
admin.site.register(Manufacturer)
admin.site.register(UnitType)
admin.site.register(Item)
admin.site.register(ItemUnit)
admin.site.register(ItemPrice)