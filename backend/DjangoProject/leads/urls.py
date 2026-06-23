from django.urls import path
from . import views

urlpatterns = [
    path('leads/', views.LeadCreateView.as_view(), name='lead-create'),
    path('leads/list/', views.LeadListView.as_view(), name='lead-list'),
    path('leads/<int:pk>/', views.LeadDetailView.as_view(), name='lead-detail'),
    path('leads/export/csv/', views.LeadExportCsvView.as_view(), name='lead-export-csv'),
    path('leads/export/xlsx/',  views.LeadExportXlsxView.as_view(),  name='lead-export-xlsx'),
    path('admin/login/', views.AdminLoginView.as_view(), name='admin-login'),
]