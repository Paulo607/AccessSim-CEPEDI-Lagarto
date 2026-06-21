from rest_framework import generics, permissions, status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.db.models import Q
from .authentication import BearerTokenAuthentication
from .models import Lead
from .serializers import LeadCreateSerializer, LeadAdminSerializer
import csv
from django.http import HttpResponse

class LeadCreateView(generics.CreateAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadCreateSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            # LeadForm.jsx espera erros em err.erros, não no formato padrão do DRF
            return Response({'erros': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        # LeadForm.jsx exibe res.mensagem na tela de sucesso
        return Response(
            {'mensagem': 'Recebemos sua mensagem! Nossa equipe entrará em contato em breve.'},
            status=status.HTTP_201_CREATED,
        )


class LeadListView(generics.ListAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadAdminSerializer
    authentication_classes = [BearerTokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        search = request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(nome_completo__icontains=search) | Q(email__icontains=search)
            )
        serializer = self.get_serializer(queryset, many=True)
        # Admin.jsx espera { leads: [...], total: N }, não uma lista "crua"
        return Response({'leads': serializer.data, 'total': queryset.count()})


class LeadDetailView(generics.RetrieveAPIView):
    queryset = Lead.objects.all()
    serializer_class = LeadAdminSerializer
    authentication_classes = [BearerTokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]

class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({'erro': 'Usuário ou senha inválidos.'}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'username': user.username})

class LeadExportCsvView(APIView):
    authentication_classes = [BearerTokenAuthentication, SessionAuthentication, BasicAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="leads.csv"'
        writer = csv.writer(response)
        writer.writerow(['Nome completo', 'E-mail', 'Organização', 'Cargo/Função',
                          'Telefone', 'Cidade/Estado', 'Segmento', 'Como posso ajudar',
                          'Mensagem', 'Criado em'])
        for lead in Lead.objects.all():
            writer.writerow([lead.nome_completo, lead.email, lead.organizacao,
                              lead.cargo_funcao, lead.telefone, lead.cidade_estado,
                              lead.get_segmento_display(), lead.get_como_ajudar_display(),
                              lead.mensagem, lead.criado_em.strftime('%d/%m/%Y %H:%M')])
        return response