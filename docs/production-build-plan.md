# NoShowNinja Production Build & Code Scaffold

This document provides a step-by-step plan for building, deploying, and verifying a production-ready NoShowNinja system. It covers schema, backend, API routes, provider integration, tests, CI, migration, simulation, and hardening, following the NoShowNinja Constitution and best practices.

## 1. Environment Setup
- Set all required environment variables in `.env.local` (Convex, Clerk, Twilio, Resend, Ollama, Stripe).
- Run `npm install` in the project root.

## 2. Convex Schema
- Paste the schema into [convex/schema.ts](convex/schema.ts).
- Deploy with `npx convex deploy --env dev`.

## 3. Core Backend Functions
- Implement helpers and core logic in:
  - [convex/auth.ts](convex/auth.ts)
  - [convex/workflows.ts](convex/workflows.ts)
  - [convex/scheduling.ts](convex/scheduling.ts)
  - [convex/ai/ollama.ts](convex/ai/ollama.ts)
  - [convex/ai/agent.ts](convex/ai/agent.ts)
  - [convex/send.ts](convex/send.ts)
  - [convex/workers/sendProcessor.ts](convex/workers/sendProcessor.ts)

## 4. API Routes & Adapters
- Add Next.js API routes for Twilio, Resend, Stripe, and health checks.
- Use Clerk JWT and provider signature verification in all routes.
- Use helpers:
  - [lib/twilioVerifier.ts](lib/twilioVerifier.ts)
  - [lib/clerkVerifier.ts](lib/clerkVerifier.ts)
  - [lib/convexClient.ts](lib/convexClient.ts)

## 5. Testing & CI
- Write unit tests (e.g., [tests/unit/auth.getOrCreateTenant.test.ts](tests/unit/auth.getOrCreateTenant.test.ts)).
- Add CI workflow ([.github/workflows/ci.yml](.github/workflows/ci.yml)).

## 6. Migration & Simulation
- Document migration plan ([docs/migrations/0001-initial-schema.md](docs/migrations/0001-initial-schema.md)).
- Add migration/backfill scripts as needed.
- Add simulation harness ([scripts/simulateLoad.ts](scripts/simulateLoad.ts)).

## 7. Production Hardening
- Store secrets securely (never commit `.env.local`).
- Implement per-tenant rate limiting and retries.
- Add structured logs and observability.
- Validate all webhook signatures and enforce tenant scoping.
- Run load and failure tests before production.
- Require human approval for schema migrations and production deploys.

## 8. Local Verification
- Start Convex: `npx convex dev`
- Start Next.js: `npm run dev`
- Run tests: `npm test`
- Run simulation: `SIM_CONVEX_URL=http://localhost:3000 SIM_CONVEX_KEY=devkey npx ts-node scripts/simulateLoad.ts`

---

**Next Steps:**
- Choose: PR scaffold, migration action, or E2E test scaffolding.
- Replace all TODOs with business logic and robust error handling.
- Update documentation and architecture diagrams as modules evolve.
