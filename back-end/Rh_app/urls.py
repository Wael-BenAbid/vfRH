# Rh_app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'leaves', views.LeaveViewSet)
router.register(r'missions', views.MissionViewSet)
router.register(r'work-hours', views.WorkHoursViewSet)
router.register(r'internships', views.InternshipViewSet)
router.register(r'job-applications', views.JobApplicationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Custom user management endpoints
    path('users/request-access/', views.UserViewSet.as_view({'post': 'request_access'}), name='user-request-access'),
    path('users/<int:pk>/approve/', views.UserViewSet.as_view({'post': 'approve_user'}), name='user-approve'),
    path('users/<int:pk>/reject/', views.UserViewSet.as_view({'post': 'reject_user'}), name='user-reject'),
    path('users/me/', views.UserViewSet.as_view({'get': 'me'}), name='user-me'),
    # Authentication endpoints
    path('auth/signup/', views.signup_view, name='signup'),
]