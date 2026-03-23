from rest_framework.permissions import BasePermission, SAFE_METHODS


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS


class IsSelf(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.owner

    
class IsOwnerOrAllowedOrSelfPassenger(BasePermission):
    def has_object_permission(self, request, view, obj):
        user = request.user

        # Lecture normale
        if request.method in SAFE_METHODS:
            return (
                user == obj.owner or
                user in obj.owner.allowed_users.all() or
                user in obj.passengers.all()
            )

        # POST sur add/remove passenger : autoriser si owner ou user lui-même
        if view.action in ['add_passenger', 'remove_passenger']:
            user_to_change = request.data.get('user_id')
            if str(user.id) == str(user_to_change) or user == obj.owner:
                return True
            return False

        # Modification normale (PATCH/DELETE) : seulement owner
        return user == obj.owner