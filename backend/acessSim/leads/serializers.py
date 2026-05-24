from rest_framework import serializers
from .models import Lead


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            'id',
            'nome',
            'email',
            'telefone',
            'empresa',
            'cargo',
            'mensagem',
            'tipo',
            'status',
            'criado_em',
            'atualizado_em',
        ]
        read_only_fields = ['id', 'status', 'criado_em', 'atualizado_em']

    def validate_email(self, value):
        return value.lower().strip()

    def validate_tipo(self, value):
        tipos_validos = ['contato', 'demo', 'piloto']
        if value not in tipos_validos:
            raise serializers.ValidationError(
                f"Tipo inválido. Escolha entre: {', '.join(tipos_validos)}"
            )
        return value
