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
