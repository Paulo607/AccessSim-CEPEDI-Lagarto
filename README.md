# AccessSim

Acessibilidade arquitetônica com IA + Realidade Aumentada — diagnóstico de conformidade com a NBR 9050 sem esperar dias por laudos manuais.

Este repositório contém o site institucional (com formulário de captação de leads) e o painel administrativo usado pela equipe AccessSim para acompanhar os contatos recebidos.

## Stack

| Camada | Tecnologias |
| :--- | :--- |
| Backend | Django 6, Django REST Framework, SQLite (dev) |
| Frontend | React 19, Vite, Tailwind CSS |
| Auth do painel | Token (DRF `TokenAuthentication`, header `Authorization: Bearer <token>`) |

## Estrutura do projeto

```
AccessSim-CEPEDI-Lagarto/
├── backend/DjangoProject/
│   ├── config/             # settings.py, urls.py raiz
│   └── leads/               # app principal
│       ├── models.py        # model Lead
│       ├── serializers.py   # tradução EN (API) <-> PT (model)
│       ├── views.py         # endpoints públicos e do painel admin
│       ├── authentication.py
│       └── urls.py
└── frontend/
    ├── src/components/      # LeadForm, Header, Footer...
    ├── src/pages/           # Home, Admin
    └── src/hooks/useApi.js  # camada de acesso à API Django
```

## Modelo de dados (`Lead`)

| Campo (model) | Tipo | Regras |
| :--- | :--- | :--- |
| `nome_completo` | CharField | Obrigatório, até 200 caracteres |
| `email` | EmailField | Obrigatório, formato validado |
| `organizacao` | CharField | Opcional, até 200 caracteres |
| `cargo_funcao` | CharField | Opcional, até 200 caracteres |
| `telefone` | CharField | Opcional, até 20 caracteres |
| `cidade_estado` | CharField | Opcional, até 100 caracteres |
| `segmento` | CharField | Opcional. `prefeitura`, `construtora`, `arquitetura`, `academia`, `outro` |
| `como_ajudar` | CharField | Padrão `agendar_demo`. `agendar_demo`, `participar_piloto`, `proposta_parceria`, `mais_informacoes` |
| `mensagem` | TextField | Opcional, até 2000 caracteres |
| `criado_em` | DateTimeField | Automático, somente leitura |

> Neste MVP, `Lead` é uma entidade isolada, sem chaves estrangeiras com outras tabelas.

### Tradução API ↔ model

O formulário público (`POST /api/leads/`) e o painel admin (`GET /api/leads/list/`) usam nomes de campo em inglês. Internamente, o DRF traduz isso para os campos em português do model:

| Campo na API | Campo no model |
| :--- | :--- |
| `name` | `nome_completo` |
| `organization` | `organizacao` |
| `role` | `cargo_funcao` |
| `phone` | `telefone` |
| `city` | `cidade_estado` |
| `segment` | `segmento` (mesmos valores nos dois lados) |
| `interest` | `como_ajudar` (**valores diferentes**, ver tabela abaixo) |
| `message` | `mensagem` |
| `created_at` | `criado_em` (só leitura, usado no painel) |

| `interest` (API) | `como_ajudar` (model) |
| :--- | :--- |
| `demo` | `agendar_demo` |
| `piloto` | `participar_piloto` |
| `parceria` | `proposta_parceria` |
| `informacao` | `mais_informacoes` |

## Endpoints da API

| Método | Rota | Autenticação | Descrição |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads/` | Pública | Cria um lead a partir do formulário do site |
| `POST` | `/api/admin/login/` | Pública | Login do painel — devolve `{ token, username }` |
| `GET` | `/api/leads/list/` | Bearer token | Lista leads — `{ leads: [...], total }`. Aceita `?search=nome ou email` |
| `GET` | `/api/leads/<id>/` | Bearer token | Detalhe de um lead específico |
| `GET` | `/api/leads/export/csv/` | Bearer token | Exporta todos os leads em CSV |

Rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>` (token obtido no login).

## Como rodar — Backend

```bash
cd backend/DjangoProject
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate        # inclui a tabela de tokens (rest_framework.authtoken)
python manage.py createsuperuser
python manage.py runserver
```

- Django admin: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/

## Como rodar — Frontend

```bash
cd frontend
npm install
npm run dev
```

- Site: http://localhost:5173
- Painel admin: http://localhost:5173/admin (login com o superusuário criado acima)

> Backend e frontend precisam estar rodando ao mesmo tempo (dois terminais) — o Vite só consegue atender `/api/...` porque está fazendo proxy para o Django.

## Variáveis de ambiente (frontend)

| Arquivo | Usado em | Valor |
| :--- | :--- | :--- |
| `.env` | `npm run dev` | `VITE_API_URL=` vazio — usa o proxy do Vite |
| `.env.production` | `npm run build` | `VITE_API_URL=https://...` — URL pública do backend, sem proxy |

## Notas para produção

- `CORS_ALLOW_ALL_ORIGINS = True` em `settings.py` é só para desenvolvimento. Em produção, troque por `CORS_ALLOWED_ORIGINS = ["https://seu-dominio.com"]`.
- Defina `DEBUG = False` e mova `SECRET_KEY` para uma variável de ambiente antes de implantar.
- `VITE_API_URL` em `.env.production` precisa apontar para o domínio real do backend já implantado (com `https://`, sem barra no final).
