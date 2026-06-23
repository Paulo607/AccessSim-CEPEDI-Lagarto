from rest_framework import serializers
from .models import Lead


INTEREST_API_TO_MODEL = {
    'demo': 'agendar_demo',
    'piloto': 'participar_piloto',
    'parceria': 'proposta_parceria',
    'informacao': 'mais_informacoes',
}
INTEREST_MODEL_TO_API = {v: k for k, v in INTEREST_API_TO_MODEL.items()}


class InterestField(serializers.ChoiceField):

    def __init__(self, **kwargs):
        super().__init__(choices=list(INTEREST_API_TO_MODEL.keys()), **kwargs)

    def to_internal_value(self, data):
        data = super().to_internal_value(data)
        return INTEREST_API_TO_MODEL[data]

    def to_representation(self, value):
        return INTEREST_MODEL_TO_API.get(value, value)


class LeadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lead
        fields = '__all__'


class LeadCreateSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='nome_completo', max_length=200)
    organization = serializers.CharField(
        source='organizacao', max_length=200, required=False, allow_blank=True)
    role = serializers.CharField(
        source='cargo_funcao', max_length=200, required=False, allow_blank=True)
    phone = serializers.CharField(
        source='telefone', max_length=20, required=False, allow_blank=True)
    city = serializers.CharField(
        source='cidade_estado', max_length=100, required=False, allow_blank=True)
    segment = serializers.ChoiceField(
        source='segmento', choices=Lead.SEGMENTO_CHOICES, required=False, allow_blank=True)
    interest = InterestField(source='como_ajudar')
    message = serializers.CharField(
        source='mensagem', required=False, allow_blank=True, allow_null=True)
    consent = serializers.BooleanField(source='consentimento')
    source = serializers.CharField(source='origem', required=False, allow_blank=True, default='site')

    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'organization', 'role', 'phone',
                   'city', 'segment', 'interest', 'message', 'consent', 'source']
    
    def validate_consent(self, value):
        if not value:
            raise serializers.ValidationError(
                "É necessário aceitar a política de privacidade para continuar."
            )
        return value

    def validate_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Informe seu nome completo.")
        return value.strip()

    def validate_email(self, value):
        return value.lower().strip()


class LeadAdminSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='nome_completo')
    organization = serializers.CharField(source='organizacao')
    role = serializers.CharField(source='cargo_funcao')
    phone = serializers.CharField(source='telefone')
    city = serializers.CharField(source='cidade_estado')
    segment = serializers.CharField(source='segmento')
    interest = InterestField(source='como_ajudar')
    message = serializers.CharField(source='mensagem')
    consent = serializers.BooleanField(source='consentimento')
    source = serializers.CharField(source='origem')
    created_at = serializers.DateTimeField(source='criado_em')

    class Meta:
        model = Lead
        fields = ['id', 'name', 'email', 'organization', 'role', 'phone',
                   'city', 'segment', 'interest', 'message', 'consent', 'source', 'created_at']