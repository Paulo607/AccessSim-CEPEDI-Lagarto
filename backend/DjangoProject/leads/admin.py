from django.contrib import admin
from .models import Lead


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = (
        'nome_completo', 'email', 'organizacao',
        'segmento', 'como_ajudar', 'consentimento', 'criado_em',
    )
    list_filter      = ('segmento', 'como_ajudar', 'consentimento', 'criado_em') 
    search_fields    = ('nome_completo', 'email', 'organizacao', 'mensagem')
    readonly_fields  = ('criado_em',)    
    list_per_page    = 25                
    date_hierarchy   = 'criado_em'       
    ordering         = ('-criado_em',)   
    fieldsets = (               
        ('Identificação', {
            'fields': ('nome_completo', 'email', 'telefone'),
        }),
        ('Organização', {
            'fields': ('organizacao', 'cargo_funcao', 'cidade_estado', 'segmento'),
        }),
        ('Interesse', {
            'fields': ('como_ajudar', 'mensagem'),
        }),
        ('Metadados', {
            'fields': ('consentimento', 'origem', 'criado_em'),
            'classes': ('collapse',),
        }),
    )