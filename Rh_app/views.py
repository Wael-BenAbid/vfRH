from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action, api_view
from datetime import datetime
import logging
import json
from django.core.mail import send_mail
from django.conf import settings

from .models import User, Leave, Mission, WorkHours, Internship, JobApplication
from .serializers import (
    UserSerializer, LeaveSerializer, MissionSerializer, 
    WorkHoursSerializer, InternshipSerializer, JobApplicationSerializer
)

# Configurer le logger
logger = logging.getLogger(__name__)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'request_access']:
            return [permissions.AllowAny()]
        elif self.action in ['approve_user', 'reject_user']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def request_access(self, request):
        """
        Demander l'accès au système
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)  # Créer un utilisateur inactif
        
        # Notifier les administrateurs de la demande d'accès
        admin_emails = User.objects.filter(user_type='admin').values_list('email', flat=True)
        try:
            send_mail(
                'Nouvelle demande d\'accès utilisateur',
                f'Un nouvel utilisateur a demandé un accès:\nNom: {user.get_full_name()}\nEmail: {user.email}\nRôle: {user.user_type}',
                settings.DEFAULT_FROM_EMAIL,
                list(admin_emails),
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Échec de l'envoi de la notification aux administrateurs: {str(e)}")
        
        return Response({
            'message': 'Demande d\'accès soumise avec succès. Un administrateur examinera votre demande.'
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def approve_user(self, request, pk=None):
        """
        Approuver une demande d'accès utilisateur
        """
        user = self.get_object()
        if not request.user.user_type == 'admin':
            return Response({'error': 'Seuls les administrateurs peuvent approuver les utilisateurs'}, status=status.HTTP_403_FORBIDDEN)
        
        user.is_active = True
        user.save()
        
        # Envoyer un e-mail d'approbation
        try:
            send_mail(
                'Votre demande d\'accès a été approuvée',
                f'Votre demande d\'accès a été approuvée. Vous pouvez maintenant vous connecter au système.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Échec de l'envoi de l'e-mail d'approbation: {str(e)}")
        
        return Response({'status': 'utilisateur approuvé'})

    @action(detail=True, methods=['post'])
    def reject_user(self, request, pk=None):
        """
        Rejeter une demande d'accès utilisateur
        """
        user = self.get_object()
        if not request.user.user_type == 'admin':
            return Response({'error': 'Seuls les administrateurs peuvent rejeter les utilisateurs'}, status=status.HTTP_403_FORBIDDEN)
        
        # Envoyer un e-mail de rejet avant de supprimer
        try:
            send_mail(
                'Statut de votre demande d\'accès',
                f'Nous regrettons de vous informer que votre demande d\'accès a été rejetée.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            logger.error(f"Échec de l'envoi de l'e-mail de rejet: {str(e)}")
        
        user.delete()
        return Response({'status': 'utilisateur rejeté'})

    def get_queryset(self):
        """
        Filtrer les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return User.objects.all()
        return User.objects.filter(id=user.id)

class LeaveViewSet(viewsets.ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Limiter les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return Leave.objects.all()
        return Leave.objects.filter(user=user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def approve_leave(self, request, pk=None):
        """
        Approuver une demande de congé
        """
        leave = self.get_object()
        if request.user.user_type != 'admin' and not request.user.is_superuser:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        leave.status = 'approved'
        leave.save()
        
        # Mise à jour du solde de congés
        days = (leave.end_date - leave.start_date).days + 1
        leave.user.leave_balance -= days
        leave.user.save()
        
        return Response({'status': 'leave approved'})
    
    @action(detail=True, methods=['post'])
    def reject_leave(self, request, pk=None):
        """
        Rejeter une demande de congé
        """
        leave = self.get_object()
        if request.user.user_type != 'admin' and not request.user.is_superuser:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        leave.status = 'rejected'
        leave.save()
        return Response({'status': 'leave rejected'})

class MissionViewSet(viewsets.ModelViewSet):
    queryset = Mission.objects.all()
    serializer_class = MissionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Limiter les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return Mission.objects.all()
        return Mission.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class WorkHoursViewSet(viewsets.ModelViewSet):
    queryset = WorkHours.objects.all()
    serializer_class = WorkHoursSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Limiter les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return WorkHours.objects.all()
        return WorkHours.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InternshipViewSet(viewsets.ModelViewSet):
    queryset = Internship.objects.all()
    serializer_class = InternshipSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Limiter les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return Internship.objects.all()
        return Internship.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobApplicationViewSet(viewsets.ModelViewSet):
    queryset = JobApplication.objects.all()
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Limiter les résultats en fonction du type d'utilisateur
        """
        user = self.request.user
        if user.is_superuser or user.user_type == 'admin':
            return JobApplication.objects.all()
        return JobApplication.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
