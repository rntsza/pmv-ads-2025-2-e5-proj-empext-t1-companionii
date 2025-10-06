# Companion — Backend (NestJS + Prisma + PostgreSQL)

Backend com autenticação JWT, Swagger, seeds e Docker.

## Requisitos

- Node.js 22+
- Docker e Docker Compose

## Configuração

1. Copie `.env.example` para `.env` e ajuste se necessário.
2. Instale deps:

   ```bash
   npm ci
   ```

3. Suba o Postgres e a API:
   ```bash
   docker compose up -d --build
   ```
4. Rode as migrações e seed (se estiver rodando local fora do container):

   ```bash
   npx prisma migrate dev
   npm run seed
   ```

5. Acesse a API e docs:
   - API: [http://localhost:3000](http://localhost:3000)
   - Swagger: [http://localhost:3000/docs](http://localhost:3000/docs)

### Login admin

- email: `${ADMIN_EMAIL}` (default: `admin@local.com`)
- senha: `${ADMIN_PASSWORD}` (default: `admin123`)

## Scripts úteis

```bash
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

## Roadmap (MVP)

- [x] Auth JWT + RBAC + OAuth Google
- [x] CRUD básico Users
- [ ] Relatórios (agregações)
- [ ] Integração IA para resumo de período
- [ ] Métricas

## Licença

MIT

---

## Google OAuth

Inicie o fluxo no navegador:

1. `GET http://localhost:3000/auth/google`

2. Após login, você será redirecionado para OAUTH_SUCCESS_REDIRECT?token=... ou o token será retornado

## Reset de senha - Fluxo Local

> Teste com MailHog
> `docker run -d -p 1025:1025 -p 8025:8025 --name mailhog mailhog/mailhog`
> Configure SMTP_HOST=localhost, SMTP_PORT=1025, SMTP_SECURE=false
> Web UI: http://localhost:8025

1. `POST /auth/forgot-password` → verifica e-mail no MailHog

2. Abrir link `WEBAPP_RESET_URL?token=...`

3. `POST /auth/reset-password` com `{ token, password }`

4. Login normal com nova senha.

---

## 🧩 Extras

- **Swagger** disponível em `/docs` com BearerAuth configurado
- **RBAC** via decorator `@Roles()` e `RolesGuard`
- **Seed** cria usuário admin, empresa e exemplos de tarefas
