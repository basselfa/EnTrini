from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Gym, Membership
from .serializers import UserSerializer, GymSerializer, MembershipSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['get', 'put'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        if request.method == 'PUT':
            serializer = self.get_serializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=400)
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class GymViewSet(viewsets.ModelViewSet):
    queryset = Gym.objects.filter(status='active')
    serializer_class = GymSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update']:
            return [permissions.IsAuthenticated()]  # Only authenticated users can create
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        if self.request.user.role not in ['gym_owner', 'admin']:
            raise permissions.PermissionDenied("Only gym owners or admins can create gyms.")
        serializer.save(owner=self.request.user)

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Membership.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)