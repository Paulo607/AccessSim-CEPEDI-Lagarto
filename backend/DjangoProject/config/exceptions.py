from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

def custom_exception_handler(exc, context):
    """
    Manipulador de exceções customizado para garantir que qualquer erro na API 
    retorne sempre um JSON no formato que o frontend espera:
    - 400 (Validation Error): {'erros': {...}}
    - 401/403/404/Outros: {'erro': 'mensagem de erro'}
    - 500 (Internal Server Error não capturado): {'erro': 'Erro interno...'}
    """
    response = exception_handler(exc, context)

    if response is not None:
        if response.status_code == status.HTTP_400_BAD_REQUEST:
            # Garante que erros de validação fiquem na chave "erros"
            if 'erros' not in response.data:
                response.data = {'erros': response.data}
        else:
            # Qualquer outro erro mapeado pelo DRF, colocamos na chave "erro" se tiver "detail"
            if 'detail' in response.data:
                response.data = {'erro': response.data['detail']}
    else:
        # Exceção não mapeada pelo DRF (como erros no código) resultariam num 500 HTML.
        # Logamos o erro no backend e retornamos 500 em JSON.
        logger.error(f"Erro inesperado: {exc}", exc_info=True)
        return Response(
            {'erro': 'Ocorreu um erro interno no servidor. Tente novamente mais tarde.'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
