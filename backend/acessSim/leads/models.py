from django.db import models

class Lead(models.Model):
    TIPO_CHOICES = [
        ('contato', 'Contato Geral'),
        ('demo', 'Agendar Demo'),
        ('piloto', 'Quero ser Piloto'),
    ]

    STATUS_CHOICES = [
        ('novo', 'Novo'),
        ('em_contato', 'Em Contato'),
        ('convertido', 'Convertido'),
        ('descartado', 'Descartado'),
    ]

    nome = models.CharField(max_length=200)
    email = models.EmailField()
    telefone = models.CharField(max_length=20, blank=True)
    empresa = models.CharField(max_length=200, blank=True)
    cargo = models.CharField(max_length=200, blank=True)
    mensagem = models.TextField(blank=True)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='contato')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='novo')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'
        ordering = ['-criado_em']

    def __str__(self):
        return f"{self.nome} ({self.email})"