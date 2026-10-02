# Trabalho Marinke

API de Produtos com **Node.js + Express + TypeScript**, persistência com **Sequelize** em banco relacional **MySQL**, interface web e testes **Jest** com cobertura mínima de 90%.

O projeto foi construído em etapas, seguindo os dois materiais da aula:

| Etapa | Origem | Onde está |
|---|---|---|
| 1. Código JavaScript com array em memória (Routes, Controller, Service, Model) | `tarefa.pptx` | `etapa-1-javascript/` |
| 2. Migração para TypeScript, Repository, Dependency Inversion e arquitetura proposta | `Aula_TS.pdf` | `src/` |
| 3. Requisitos obrigatórios: interface, Sequelize, banco relacional, CRUD completo, testes Jest | enunciado | `src/`, `public/`, `tests/` |

## Arquitetura (PDF, slide "Arquitetura proposta")

```
HTTP Request
   ↓
Routes          src/routes/produto.routes.ts
   ↓
Controller      src/controllers/produto.controller.ts
   ↓
Use Case        src/usecases/produto.usecases.ts      (era o "Service" do PowerPoint)
 ↙        ↘
Repository   Domain
 src/repositories/   src/domain/produto.ts
   ↓
Sequelize       src/models/produto.model.ts
   ↓
MySQL
```

- **Domain**: `Produto` (estado + `estaEmPromocao()` + regra de validação). Não conhece HTTP nem banco.
- **Repository**: a interface `ProdutoRepository` é o contrato; `ProdutoRepositorySequelize` é a implementação (*Dependency Inversion*). Os casos de uso só enxergam a interface.
- **Controller**: único que conhece HTTP; traduz erros de negócio em status (400, 404, 500).
- **Composição**: `src/container.ts` é o único lugar onde o Sequelize é escolhido.

## Como rodar

Pré-requisitos: Node.js 20+ e Docker (ou um MySQL próprio).

```bash
# 1. Banco MySQL
docker compose up -d

# 2. Dependências e variáveis de ambiente
npm install
cp .env.example .env        # ajuste se usar outro MySQL

# 3. Desenvolvimento (tsx, recarrega ao salvar)
npm run dev

# 4. Build e execução em produção
npm run build
npm start
```

Abra **http://localhost:3000** para a interface. Na primeira execução a tabela `produtos` é criada (`sequelize.sync()`) e populada com Notebook e Mouse (os dados do desafio).

Para rodar a Etapa 1 isolada (array em memória, sem banco): `node etapa-1-javascript/app.js` (após `npm install`).

## Endpoints

| Método | Rota | Resposta |
|---|---|---|
| GET | `/produtos` | 200 + lista |
| GET | `/produtos/:id` | 200 · 404 se não existe · 400 se id inválido |
| POST | `/produtos` | 201 · 400 se dados inválidos |
| PUT | `/produtos/:id` | 200 · 400 · 404 |
| DELETE | `/produtos/:id` | 204 · 400 · 404 |

Corpo de POST/PUT: `{ "nome": "Teclado", "preco": 180 }`. As respostas incluem `emPromocao` (preço menor que 100).

## Testes

```bash
npm test
```

O Jest já roda com cobertura e **falha se qualquer métrica (statements, branches, functions, lines) ficar abaixo de 90%**. Nos testes o Sequelize usa **SQLite em memória** (`NODE_ENV=test`), então não precisa de MySQL. Relatório HTML em `coverage/lcov-report/index.html`.

- `tests/domain`: regras do `Produto` e validações
- `tests/usecases`: casos de uso com um repositório falso (prova a inversão de dependência)
- `tests/repositories`: `ProdutoRepositorySequelize` contra o banco
- `tests/routes`: CRUD completo via HTTP (Supertest), erros 400/404/500 e a interface em `/`
- `tests/config`, `tests/middlewares`, `tests/app.test.ts`: configuração do banco, seed, tratamento de erros e inicialização

## Estrutura

```
trabalho-marinke/
├── etapa-1-javascript/   código do tarefa.pptx (JS, em memória)
├── public/               interface (index.html, styles.css, app.js)
├── src/                  API em TypeScript
├── tests/                testes Jest
├── docker-compose.yml    MySQL 8.4
├── tsconfig.json         configuração do PDF
└── jest.config.js
```
