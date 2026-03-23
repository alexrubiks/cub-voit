from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Vehicle, Competition, Travel

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'wca_id', 'pseudo', 'is_staff')

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('wca_id', 'pseudo')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('wca_id', 'pseudo')}),
    )


admin.site.register(User, UserAdmin)


@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "seats")
    search_fields = ("name",)
    list_filter = ("owner",)


@admin.register(Competition)
class CompetitionAdmin(admin.ModelAdmin):
    list_display = ("name", "first_day", "last_day", "location_name")
    search_fields = ("name", "location_name")


@admin.register(Travel)
class TravelAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "start_location_name", "end_location_name")
    search_fields = ("name", "start_location_name", "end_location_name")
    list_filter = ("owner",)