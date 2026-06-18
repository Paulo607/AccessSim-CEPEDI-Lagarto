# AccessSim-CEPEDI-Lagarto

## Modelo de Dados (Lead)

A tabela `Lead` armazena os contatos captados pelo portal. Abaixo estão os detalhes dos campos, tipos e regras de negócio:

| Campo | Tipo de Dado (Banco) | Regras e Restrições |
| :--- | :--- | :--- |
| **nome_completo** | `CharField` | Obrigatório. Máximo de 200 caracteres. |
| **email** | `EmailField` | Obrigatório. Validação de formato de e-mail. |
| **organizacao** | `CharField` | Opcional. Máximo de 200 caracteres. |
| **cargo_funcao** | `CharField` | Opcional. Máximo de 200 caracteres. |
| **telefone** | `CharField` | Opcional. Máximo de 20 caracteres. |
| **cidade_estado** | `CharField` | Opcional. Máximo de 100 caracteres. |
| **segmento** | `CharField` | Opcional. Escolha restrita: ('prefeitura', 'Prefeitura / Órgão Público'),('construtora', 'Construtora / Incorporadora'), ('arquitetura', 'Arquitetura / Engenharia'), ('academia', 'Academia / Pesquisa'),('outro', 'Outro') |
| **como_ajudar** | `CharField` | Opcional. Padrão (agendar_demo) Escolha restrita: ('agendar_demo', 'Agendar Demo'), ('participar_piloto', 'Participar do Piloto'), ('proposta_parceria', 'Proposta de Parceria'), ('mais_informacoes', 'Mais Informações') |
| **criado_em** | `DateTimeField` | Automático (Timestamp de criação). Apenas leitura. |
| **mensagem** | `TextField` | Opcional. Maximo 2000 caracteres. |

> **Nota de Relacionamentos:** Neste MVP inicial, a tabela `Lead` é uma entidade isolada e não possui chaves estrangeiras (Foreign Keys) com outras tabelas.


# AccessSim - Backend

## Como rodar localmente

1. Clone o repositório
2. Crie um ambiente virtual: python -m venv venv
3. Ative o ambiente virtual
4. Instale as dependências: pip install -r requirements.txt
5. Rode as migrações: python manage.py migrate
6. Crie um usuário admin: python manage.py createsuperuser
7. Rode o servidor: python manage.py runserver
8. Acesse http://127.0.0.1:8000/admin/ para o painel administrativo
9. API de leads: http://127.0.0.1:8000/api/leads/
