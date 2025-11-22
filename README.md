# COMPANION - Sistema de Gestão Diária para Desenvolvedores

`Análise e Desenvolvimento de Sistemas`

`Projeto: Extensão Universitária - Microcomputadores e Redes`

`2025/2`

O Companion é uma plataforma web inteligente desenvolvida para desenvolvedores freelancers e pequenas equipes que precisam gerenciar múltiplos projetos e clientes de forma eficiente. O sistema combina um kanban com funcionalidades de time tracking, geração automática de relatórios profissionais através de IA, e métricas de produtividade, centralizando toda a gestão diária em uma interface visual intuitiva.

A solução visa resolver o problema da falta de uma ferramenta unificada que integre gestão de tarefas, controle de tempo e geração de relatórios, eliminando a necessidade de usar ferramentas desconectadas e processos manuais que geram perda de produtividade e dificultam a prestação de contas aos clientes.

## Integrantes

- Aaron Carvalho Balbino
- Adriana Pereira Nascimento
- Enzo Gomes Azevedo
- William da Silva Rodrigues

## Orientadora

- Sandra Maria Silveira

## Instruções de utilização

### Pré-requisitos

- Docker
- Docker Compose
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação e Execução

#### Backend (NestJS + Prisma)

##### Opção 1: Execução Completa com Docker (Recomendado)

1. Navegue para o diretório do backend:

   ```bash
   cd codigo-fonte/backend
   ```

2. Configure as variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

   (Edite o arquivo `.env` conforme necessário)

3. Execute com Docker Compose:
   ```bash
   docker compose up -d --build
   ```

Isso irá inicializar:

- **Backend API**: `http://localhost:3000`
- **Swagger (Documentação)**: `http://localhost:3000/docs`
- **PostgreSQL**: `localhost:5432`
- **PgAdmin**: `http://localhost:8081` (admin@local.com / admin)
- **MailHog**: `http://localhost:8025` (para testes de email)

**Login padrão do admin:**

- Email: `admin@local.com`
- Senha: `admin123`

##### Opção 2: Execução Local (Backend) + Docker (Banco de Dados)

1. Navegue para o diretório do backend:

   ```bash
   cd codigo-fonte/backend
   ```

2. Copie `.env.example` para `.env` e ajuste se necessário.
3. Instale deps:

   ```bash
   npm ci
   ```

4. Suba o Postgres e a API:
   ```bash
   docker compose up -d --build
   ```
5. Rode as migrações e seed (se estiver rodando local fora do container):

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

6. Acesse a API e docs:
   - API: [http://localhost:3000](http://localhost:3000)
   - Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

#### Frontend (React + Vite)

1. Navegue para o diretório do frontend:

   ```bash
   cd codigo-fonte/frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O frontend estará disponível em `http://localhost:5173`

### Funcionalidades Principais

- **Dashboard Kanban Temporal**: Organize suas tarefas em colunas Futuro | Hoje | Passado
- **Timer Integrado**: Controle de tempo com cronômetro para cada tarefa
- **Gestão de Empresas/Clientes**: Organize tarefas por empresa com identidade visual
- **Relatórios Automáticos**: Geração de relatórios profissionais em PDF com resumos de IA
- **Métricas de Produtividade**: Acompanhe seu desempenho e distribuição de tempo

### Execução de Testes

#### Backend

```bash
cd codigo-fonte/backend
npm run test
npm run test:e2e
```

#### Frontend

```bash
cd codigo-fonte/frontend
npm run test
npm run test:e2e
```

# Documentação

<ol>
<li><a href="documentos/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="documentos/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="documentos/03-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="documentos/04-Testes de Software.md"> Testes de Software</a></li>
<li><a href="documentos/05-Implantação.md"> Implantação</a></li>
</ol>

# Código

<li><a href="codigo-fonte/backend/README.md"> Backend (NestJS + Prisma)</a></li>
<li><a href="codigo-fonte/frontend/README.md"> Frontend (React + Vite)</a></li>

# Apresentação

<li><a href="apresentacao/README.md"> Apresentação da solução</a></li>
