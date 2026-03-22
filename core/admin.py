from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'wca_id', 'pseudo', 'is_staff')

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Extra Info', {'fields': ('wca_id', 'pseudo')}),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Extra Info', {'fields': ('wca_id', 'pseudo')}),
    )


admin.site.register(User, UserAdmin)