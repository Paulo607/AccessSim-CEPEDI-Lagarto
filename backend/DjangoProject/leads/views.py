from rest_framework import generics, permissions
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from .models import Lead
from .serializers import LeadSerializer
import csv
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required

class LeadCreateView(generics.CreateAPIView):
    """
    Endpoint público: recebe os dados do formulário do site (Contato / Agendar Demo).
    Qualquer pessoa pode enviar (POST), mas não pode listar.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [permissions.AllowAny]


class LeadListView(generics.ListAPIView):
    """
    Endpoint protegido: lista os leads. Só usuários autenticados (equipe AccessSim)
    podem acessar.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]


class LeadDetailView(generics.RetrieveAPIView):
    """
    Endpoint protegido: detalha um lead específico pelo ID.
    """
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]


@login_required
def exportar_leads_csv(request):
    """
    Exporta todos os leads cadastrados em formato CSV.
    Requer que o usuário esteja logado (login_required).
    """
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="leads.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'Nome completo', 'E-mail', 'Organização', 'Cargo/Função',
        'Telefone', 'Cidade/Estado', 'Segmento', 'Como posso ajudar','Mensagem', 'Criado em'
    ])

    leads = Lead.objects.all()
    for lead in leads:
        writer.writerow([
            lead.nome_completo,
            lead.email,
            lead.organizacao,
            lead.cargo_funcao,
            lead.telefone,
            lead.cidade_estado,
            lead.get_segmento_display(),
            lead.get_como_ajudar_display(),
            lead.mensagem,
            lead.criado_em.strftime('%d/%m/%Y %H:%M'),
        ])

    return response