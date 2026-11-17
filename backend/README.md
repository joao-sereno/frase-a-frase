# Backend - Frase a Frase (FastAPI)

API com IA para gerar exercícios de inglês e corrigir frases dos estudantes.

## Estrutura

```
backend/
  main.py              app FastAPI, CORS e rotas de status
  app/config.py        configurações por variáveis de ambiente
  app/schemas.py       schemas Pydantic (entrada e saída)
  app/routers/         endpoints (/api/correct e /api/generate)
  app/services/ai.py   integração com a IA
  app/store.py         armazenamento em memória (vira banco na Sprint 4)
```

## Rodar localmente

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env      # edite o .env e coloque a sua chave da IA
uvicorn main:app --reload
```

Documentação interativa: http://localhost:8000/docs

## Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `AI_API_KEY` | chave da IA (só no servidor, nunca no repositório) |
| `AI_BASE_URL` | endereço base de uma API compatível com `/chat/completions` |
| `AI_MODEL` | nome do modelo do Gemini |
| `CORS_ORIGINS` | endereços do frontend autorizados, separados por vírgula |

## Endpoints

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
`422` dados inválidos, `404` exercício desconhecido, `502` falha na IA, `503` chave da IA não configurada.

## Hospedagem (Render, plano gratuito)

- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment: `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL`, `CORS_ORIGINS`
