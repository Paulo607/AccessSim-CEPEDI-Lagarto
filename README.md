# AccessSim

Acessibilidade arquitetônica com IA + Realidade Aumentada — diagnóstico de conformidade com a NBR 9050 sem esperar dias por laudos manuais.

Este repositório contém o site institucional (com formulário de captação de leads) e o painel administrativo usado pela equipe AccessSim para acompanhar os contatos recebidos.

## Stack

| Camada | Tecnologias |
| :--- | :--- |
| Backend | Django 6, Django REST Framework, PostgreSQL |
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

**Pré-requisitos:** Python 3 instalado e PostgreSQL rodando localmente (com um banco vazio criado, ex: `accesssim_db`).

```bash
cd backend/DjangoProject

# 1. Crie o arquivo .env copiando do exemplo e ajuste a senha do seu banco
cp .env.example .env

# 2. Configure o ambiente virtual e instale as dependências
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Rode as migrações (cria as tabelas no PostgreSQL)
python manage.py migrate
python manage.py createsuperuser

# 4. Inicie o servidor
python manage.py runserver
```

- Django admin: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/

## Como rodar — Frontend

**Pré-requisitos:** Node.js instalado.

```bash
cd frontend

# Crie o arquivo .env copiando do exemplo (VITE_API_URL aponta para localhost)
cp .env.example .env

npm install
npm run dev
```

- Site: http://localhost:5173
- Painel admin: http://localhost:5173/admin (login com o superusuário criado acima)

> Backend e frontend precisam estar rodando ao mesmo tempo (em dois terminais).

## Configuração de Deploy e Produção

A aplicação já está completamente preparada para rodar em produção utilizando as melhores práticas:

- **Variáveis de Ambiente:** Toda configuração sensível (Segurança, Bancos de Dados, Hosts e CORS) é injetada dinamicamente via arquivo `.env`. Veja o arquivo `.env.example` no diretório do backend para referência.
- **Servidor de Produção:** O `gunicorn` já está configurado no `requirements.txt` como servidor HTTP oficial WSGI.
- **Arquivos Estáticos:** A biblioteca `whitenoise` está ativa no `settings.py` (com `STATIC_ROOT = 'staticfiles'`) e intercepta a entrega de arquivos estáticos sem precisar de NGINX separado.
- **Segurança HTTPS:** Flags essenciais como `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` e `SECURE_HSTS_SECONDS` são facilmente ativadas inserindo seu valor `True` no `.env` do servidor online.

Para gerar a versão final do Frontend para subida (Vercel, Netlify, S3, etc):
```bash
cd frontend
# Garanta que o .env.production está com a VITE_API_URL correta do backend de produção
npm run build
```
O comando gerará a pasta `dist/` otimizada e minificada para deploy estático.

### Hospedagem 

| Camada   | Serviço | URL                                                  |
| -------- | ------- | ----------------------------------------------------- |
| Frontend | Vercel  | https://access-sim-cepedi-lagarto.vercel.app          |
| Backend  | Render  | https://accesssim-backend.onrender.com                |
| Banco    | Render  | PostgreSQL (serviço gerenciado separado do backend)   |

### Criação do superusuário (`create_admin.py`)

O backend inclui um script (`create_admin.py`) responsável por criar ou atualizar o superusuário do painel administrativo automaticamente a cada deploy. Ele é executado como parte do **Build Command** do Render, logo após as migrações:

```
pip install -r requirements.txt && python manage.py migrate && python create_admin.py
```

O script lê as credenciais de variáveis de ambiente (nunca hardcoded no código) e:
- Cria o superusuário se ele ainda não existir;
- Atualiza a senha do usuário existente, caso as variáveis mudem;
- Não faz nada se `ADMIN_PASSWORD` não estiver definida (evita criação acidental sem senha).

**Variáveis de ambiente necessárias no serviço do Render** (configuradas em *Environment*, nunca commitadas no repositório):

```
# Banco de dados
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

# Segurança
SECRET_KEY=
DEBUG=False
ALLOWED_HOSTS=
CORS_ALLOW_ALL_ORIGINS=

# Superusuário do painel admin
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_EMAIL=
```
