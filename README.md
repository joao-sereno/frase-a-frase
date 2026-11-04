# Frase a Frase

Sistema web para praticar a construção de frases em inglês com apoio de IA, voltado a estudantes da educação básica pública (Ideia 3: lacunas no ensino de gramática e na formação de frases).

**Problema:** muitos estudantes chegam ao ensino fundamental e médio com lacunas em gramática e vocabulário básicos, o que dificulta compreender e produzir textos em inglês. Nas turmas cheias, o professor tem pouco tempo para corrigir frase por frase.

**Usuários-alvo:** professores de inglês (escolhem o tópico gramatical que a turma precisa reforçar) e estudantes (praticam em trilhas).

**Papel da IA:** gerar exercícios de formação de frases em situações do dia a dia, corrigir as respostas do aluno e explicar o erro em português simples. A dificuldade sobe conforme o aluno acerta.

## Estado atual: Sprint 1

Frontend em Next.js com **dados mockados** (a correção por IA é simulada em `frontend/lib/feedback.ts`). Já inclui:

- componentes reutilizáveis (`frontend/components/`)
- formulário de resposta com feedback visual (acerto, erro e carregamento)
- formulário do professor para criar tópicos, com validação
- listagem de trilhas e de respostas
- gerenciamento de estado com Context API (`frontend/context/`)

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
npm run dev        # http://localhost:3000
```

Para gerar a versão estática (pasta `frontend/out/`):

```bash
npm run build
```

## Backend

Será adicionado nas próximas sprints (FastAPI, JWT, SQLModel).

## Equipe

- João Lucas Damato Drummond
- João Pedro de Oliveira Mendes Sereno 

