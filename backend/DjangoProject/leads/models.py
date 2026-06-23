from django.db import models


class Lead(models.Model):

    SEGMENTO_CHOICES = [
        ('prefeitura', 'Prefeitura / Órgão Público'),
        ('construtora', 'Construtora / Incorporadora'),
        ('arquitetura', 'Arquitetura / Engenharia'),
        ('academia', 'Academia / Pesquisa'),
        ('outro', 'Outro'),
    ]

    AJUDA_CHOICES = [
        ('agendar_demo', 'Agendar Demo'),
        ('participar_piloto', 'Participar do Piloto'),
        ('proposta_parceria', 'Proposta de Parceria'),
        ('mais_informacoes', 'Mais Informações'),
    ]

    nome_completo = models.CharField(max_length=200)
    email = models.EmailField(max_length=254)
    organizacao = models.CharField(max_length=200, blank=True)
    cargo_funcao = models.CharField(max_length=200, blank=True)
    telefone = models.CharField(max_length=20, blank=True)
    cidade_estado = models.CharField(max_length=100, blank=True)
    segmento = models.CharField(max_length=20, choices=SEGMENTO_CHOICES, blank=True)
    como_ajudar = models.CharField(max_length=20, choices=AJUDA_CHOICES, default='agendar_demo')
    mensagem       = models.TextField(max_length=2000, blank=True, null=True)
    consentimento  = models.BooleanField(default=False)
    origem         = models.CharField(max_length=100, blank=True, default='site')
    criado_em      = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.nome_completo} - {self.email}"

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'