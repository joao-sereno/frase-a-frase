# Frase a Frase

Sistema web para praticar a construção de frases em inglês com apoio de IA, voltado a estudantes da educação básica pública (Ideia 3: lacunas no ensino de gramática e na formação de frases).

**Problema:** muitos estudantes chegam ao ensino fundamental e médio com lacunas em gramática e vocabulário básicos, o que dificulta compreender e produzir textos em inglês. Nas turmas cheias, o professor tem pouco tempo para corrigir frase por frase.

**Usuários-alvo:** professores de inglês (escolhem o tópico gramatical que a turma precisa reforçar) e estudantes (praticam em trilhas).

**Papel da IA:** gerar exercícios de formação de frases em situações do dia a dia, corrigir as respostas do aluno e explicar o erro em português simples. A dificuldade sobe conforme o aluno acerta.

## Estado atual: Sprint 3 (Integrado em produção)

Frontend em Next.js integrado à API FastAPI, com autenticação JWT, armazenamento em memória populado por seed inicial e geração e correção de frases por IA em produção.

- **Frontend (Vercel):** https://frase-a-frase-flax.vercel.app
- **Backend / API (Render):** https://frase-a-frase-api.onrender.com
- **Documentação interativa (Swagger):** https://frase-a-frase-api.onrender.com/docs

> **Observação sobre o servidor gratuito:** como o backend está hospedado no plano gratuito do Render, o serviço entra em suspensão após 15 minutos de inatividade. A primeira requisição pode levar de 30 a 60 segundos para ativar o servidor.

### Sprint 1 — Frontend em Next.js (dados mockados)
- componentes reutilizáveis (`frontend/components/`)
- formulário de resposta com feedback visual (acerto, erro e carregamento)
- formulário do professor para criar tópicos, com validação
- listagem de trilhas e de respostas
- gerenciamento de estado com Context API (`frontend/context/`)
- simulação inicial da correção por IA (`frontend/lib/feedback.js`)

### Sprint 2 — Backend em FastAPI e integração com IA
- criação da API REST em FastAPI (`backend/`)
- configurações por variáveis de ambiente (`backend/app/config.py`) e schemas Pydantic (`backend/app/schemas.py`)
- integração com modelo de IA compatível com `/chat/completions` (`backend/app/services/ai.py`)
- endpoints de geração de exercícios (`POST /api/generate`) e correção de frases (`POST /api/correct`)
- armazenamento em memória (`backend/app/store.py`) e hospedagem inicial no Render

### Sprint 3 — Autenticação JWT, Seed e integração em produção
- implementação da autenticação JWT (`backend/app/routers/auth.py` com `/api/auth/register`, `/api/auth/login`, `/api/auth/token` e `/api/auth/me`)
- criação do módulo de carga inicial (`backend/app/seed.py`) com contas de demonstração
- proteção das rotas de IA com token JWT e configuração de `CORS_ORIGINS` para o domínio de produção
- substituição dos dados mockados do frontend (`frontend/lib/feedback.js`) por chamadas reais à API via `NEXT_PUBLIC_API_URL`
- publicação do frontend na Vercel integrado ao backend no Render

## Estrutura

```
frontend/   Next.js (App Router) + Tailwind CSS
backend/    FastAPI (a partir da Sprint 2)
```

## Como rodar o frontend

Requisitos: Node.js 20 ou superior.

```bash
cd frontend
npm install
cp .env.example .env.local   # edite e defina NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev                  # http://localhost:3000
```

Para gerar a versão estática (pasta `frontend/out/`):

```bash
npm run build
```

## Backend - Frase a Frase (FastAPI)

API com IA para gerar exercícios de inglês e corrigir frases dos estudantes.

## Estrutura

```
backend/
  main.py              app FastAPI, CORS, inicialização do seed e rotas de status
  app/config.py        configurações por variáveis de ambiente
  app/schemas.py       schemas Pydantic (entrada e saída)
  app/routers/         endpoints (/api/auth/*, /api/correct e /api/generate)
  app/services/ai.py   integração com a IA
  app/store.py         armazenamento em memória (vira banco na Sprint 4)
  app/seed.py          dados iniciais e contas de demonstração (a partir da Sprint 3)
```

## Rodar localmente

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # edite o .env e coloque a sua chave da IA e segredo JWT
uvicorn main:app --reload
```

Documentação interativa: http://localhost:8000/docs

## Variáveis de ambiente

### Backend (`backend/.env` ou painel do Render)

| Variável | Para que serve |
|---|---|
| `AI_API_KEY` | chave da IA (só no servidor, nunca no repositório) |
| `AI_BASE_URL` | endereço base de uma API compatível com `/chat/completions` |
| `AI_MODEL` | nome do modelo do Gemini |
| `JWT_SECRET` | chave secreta usada para assinar e validar os tokens JWT |
| `CORS_ORIGINS` | endereços do frontend autorizados, separados por vírgula (ex.: `https://frase-a-frase-flax.vercel.app,http://localhost:3000`) |

### Frontend (`frontend/.env.local` ou painel da Vercel)

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_API_URL` | endereço base da API FastAPI, sem barra no final (`http://localhost:8000` localmente ou `https://frase-a-frase-api.onrender.com` em produção) |

## Contas de demonstração (Seed)

Como o armazenamento atual opera em memória (`app/store.py`), os dados são reiniciados sempre que o servidor reinicia. O módulo `app/seed.py` recria automaticamente duas contas padrão na inicialização:

- **Aluno:** `aluno@fraseafrase.com` | **Senha:** `aluno123`
- **Professor:** `professor@fraseafrase.com` | **Senha:** `prof123`

## Endpoints

### Autenticação (JWT)
- `POST /api/auth/register`: cadastra um novo usuário (`student` ou `teacher`).
- `POST /api/auth/login`: login via JSON (usado pelo frontend), retorna o `access_token` JWT.
- `POST /api/auth/token`: login OAuth2 (usado pelo botão Authorize do `/docs`).
- `GET /api/auth/me`: retorna os dados do usuário autenticado via cabeçalho `Authorization: Bearer <token>`.

### POST /api/correct
```json
{ "exercise_id": "sp-1", "answer": "I wake up at 7 o'clock." }
```
Resposta:
```json
{ "correct": true, "feedback": "Muito bem! ...", "suggestion": "I wake up at 7 o'clock." }
```
Campos opcionais `situation` e `suggestion` podem ser enviados para a correção funcionar mesmo que o servidor tenha reiniciado e esquecido o exercício.

### POST /api/generate
```json
{ "topic": "Present Continuous", "count": 5 }
```
`count` é opcional (1 a 10, padrão 5). Resposta:
```json
{ "exercises": [ { "id": "gen-ab12cd34-1", "level": 1, "situation": "...", "hint": "...", "suggestion": "..." } ] }
```

### Códigos de erro
`401` credenciais inválidas, token ausente ou expirado, `422` dados inválidos, `404` exercício desconhecido, `502` falha na IA, `503` chave da IA não configurada.

## Hospedagem (Render, plano gratuito)

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port \$PORT`
- Environment: `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, `JWT_SECRET`, `CORS_ORIGINS`

## Hospedagem (Vercel)

- Framework Preset: `Next.js`
- Root Directory: `frontend`
- Environment: `NEXT_PUBLIC_API_URL=https://frase-a-frase-api.onrender.com`

## Equipe

- João Lucas Damato Drummond
- João Pedro de Oliveira Mendes Sereno
