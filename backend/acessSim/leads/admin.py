from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ['nome', 'email', 'tipo', 'status', 'empresa', 'criado_em']
    list_filter = ['tipo', 'status', 'criado_em']
    search_fields = ['nome', 'email', 'empresa', 'telefone']
    readonly_fields = ['criado_em', 'atualizado_em']
    list_per_page = 25
    fieldsets = (
        ('Dados do Contato', {
            'fields': ('nome', 'email', 'telefone', 'empresa', 'cargo')
        }),
        ('Solicitação', {
            'fields': ('tipo', 'mensagem')
        }),
        ('Gestão Interna', {
            'fields': ('status', 'criado_em', 'atualizado_em')
        }),
    )