# AccessSim-CEPEDI-Lagarto

## Modelo de Dados (Lead)

A tabela `Lead` armazena os contatos captados pelo portal. Abaixo estão os detalhes dos campos, tipos e regras de negócio:

| Campo | Tipo de Dado (Banco) | Regras e Restrições |
| :--- | :--- | :--- |
| **nome** | `CharField` | Obrigatório. Máximo de 200 caracteres. |
| **email** | `EmailField` | Obrigatório. Validação de formato de e-mail. |
| **telefone** | `CharField` | Opcional. Máximo de 20 caracteres. |
| **empresa** | `CharField` | Opcional. Máximo de 200 caracteres. |
| **cargo** | `CharField` | Opcional. Máximo de 200 caracteres. |
| **mensagem** | `TextField` | Opcional. Sem limite de tamanho. |
| **tipo** | `CharField` | Escolha restrita: `contato`, `demo`, `piloto`. (Padrão: `contato`). |
| **status** | `CharField` | Escolha restrita: `novo`, `em_contato`, `convertido`, `descartado`. (Padrão: `novo`). |
| **criado_em** | `DateTimeField` | Automático (Timestamp de criação). Apenas leitura. |
| **atualizado_em**| `DateTimeField` | Automático (Timestamp de modificação). Apenas leitura. |

> **Nota de Relacionamentos:** Neste MVP inicial, a tabela `Lead` é uma entidade isolada e não possui chaves estrangeiras (Foreign Keys) com outras tabelas.