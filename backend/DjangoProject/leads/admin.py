from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'nome_completo', 'email', 'organizacao',
        'segmento', 'como_ajudar', 'criado_em'
    )
    list_filter = ('segmento', 'como_ajudar')
    search_fields = ('nome_completo', 'email', 'organizacao','mensagem')