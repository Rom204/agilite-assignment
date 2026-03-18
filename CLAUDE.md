# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js/Express REST API for a support ticket management system. Backend only — no frontend. Uses TypeScript, Prisma ORM, and PostgreSQL.

## Commands

All commands run from the `backend/` directory.

```bash
# Start server (production)
npm start

# Start with hot reload (development)
npm run dev

# Seed sample data
npx tsx src/sample.ts

# Prisma migrations
npx prisma migrate dev
npx prisma generate
```

## Architecture

```
src/
  index.ts          # Express app setup, middleware, server start
  routes/index.ts   # Aggregates all routes, mounted at /api
  routes/ticket.routes.ts   # Ticket/reply endpoint definitions
  controllers/ticket.controller.ts  # Business logic for all ticket endpoints
  lib/prisma.ts     # Singleton Prisma client
```

**Request flow:** `index.ts` → `routes/index.ts` → `ticket.routes.ts` → `ticket.controller.ts` → Prisma → PostgreSQL

**Database models** (`prisma/schema.prisma`):
- `Ticket`: id (CUID), email, name, subject, message, productId (Fake Store API item), status (open/closed), createdAt
- `Reply`: id (CUID), message, isAdmin (bool), createdAt, ticketId (FK)
- Generated Prisma client outputs to `../generated/prisma` (excluded from git)

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| POST | /api/tickets | Create ticket |
| GET | /api/tickets | List all tickets (with reply counts) |
| GET | /api/tickets/:id | Get ticket with full replies |
| POST | /api/tickets/:id/replies | Add reply to ticket |

## Configuration

- Port: `PORT` env var, defaults to 5000
- Database: `DATABASE_URL` in `.env` (gitignored)
- ES modules (`"type": "module"` in package.json)
- Prisma config via `prisma.config.ts` at repo root

## Notes

- No test framework is configured
- `src/server.ts` is unused legacy code
- `api-test.http` contains manual HTTP test examples
- `closeTicket` controller (`PATCH /:id/close`) is implemented but its route is commented out in `ticket.routes.ts`
- Uses Express 5 (`^5.2.1`) — note breaking changes from Express 4 (e.g., async error handling built-in)
