# 📘 Project Best Practices

## 1. Project Purpose

NoShowNinja is a multi-tenant Next.js + Convex application focused on messaging, scheduling, analytics, and AI-assisted workflows. It exposes API routes (webhooks, provider integrations) and Convex backend functions for durable, tenant-isolated operations. Security, reliability, and strong typing are first-class concerns.

## 2. Project Structure

- app/ — Next.js App Router frontend and API routes
  - app/api/ — Provider webhooks and internal routes (e.g., Resend, Stripe, Twilio)
- components/ — UI primitives (read-only for most contributors)
- convex/ — Backend domain logic, actions, workflows, and schema (schema is protected)
- docs/ — Documentation and plans
- tests/ — Unit, integration, and E2E tests
- infra/ — Deployment and infrastructure automation
- .github/workflows/ — CI/CD pipelines
- Configuration files: tsconfig.json, eslint.config.mjs, next.config.ts, postcss.config.mjs, .prettierrc

Conventions

- Frontend logic in app/; server routes in app/api/<provider>/<endpoint>
- Convex functions in convex/. 
- Actions, workflows, and workers organized by domains (e.g., messaging, scheduling, analytics).
- All backend domain logic lives in convex/
- AllPI routes should be thin adapters to Convex functions.
- Tenant isolation is mandatory for all Convex functions and external webhooks

## 3. Test Strategy

- Frameworks
  - Unit tests: colocated under tests/unit/
  - Integration tests: tests/integration/
  - E2E tests: tests/e2e/ (Playwright)
- Mocking guidelines
  - Mock all external providers: Twilio, Resend, Ollama, Stripe
  - Avoid network calls; use fixtures and deterministic responses
- Test philosophy
  - Unit tests for pure logic and Convex helpers
  - Integration tests for Convex interactions and seeded fixtures, with cleanup
  - E2E for critical user flows
- Coverage
  - Aim for high coverage on core business rules and edge cases (webhook signatures, auth paths, tenant isolation)

## 4. Code Style

- TypeScript
  - Strict mode enabled; do not use any type
  - All exported functions require explicit return types
  - Prefer small, composable functions and pure utilities
- Async
  - Always await asynchronous effects and handle promise rejections
- Naming
  - Files: kebab-case for route folders, PascalCase for React components, snake_case for migrations/fixtures if present
  - Variables: camelCase; Classes/Components: PascalCase
  - Convex functions named by domain: module:functionName (e.g., messaging:handleInboundResend)
- Comments & Docs
  - Use concise JSDoc for exported APIs; document expected inputs/outputs and error cases
  - Avoid leaking secrets in logs; never log raw provider payloads or signatures
- Errors
  - Use typed errors or narrow error handling; return structured NextResponse for API routes
  - Validate inputs at the boundary (Zod/convex/values) and keep internals typed

## 5. Common Patterns

- Validation
  - Zod for advanced validation and convex/values for shape constraints in actions
  - Permit-list request body fields; reject unexpected properties
- Tenant Isolation
  - Every Convex function validates tenantId; never cross-tenant read/write
- Security
  - Validate webhook signatures for all providers
  - Do not log secrets; store secrets in environment variables (.env.local)
- Reliability
  - Use retry/worker patterns for transient failures (Action Retrier, Workpool)
  - Prefer idempotent handlers for webhooks and external callbacks
- Architecture
  - API routes are thin: auth + validation + dispatch to Convex action
  - Domain logic in convex/ modules (e.g., messaging, scheduling, analytics)

## 6. Do's and Don'ts

- Do
  - Enforce strict typing and explicit return types
  - Validate inputs at the boundary with Zod and convex/values
  - Keep API handlers minimal; delegate to Convex
  - Enforce tenant scoping in every Convex function
  - Add unit/integration/E2E tests for new features and edge cases
  - Use Tailwind and shadcn/ui for UI work
  - Keep secrets out of logs and source control
- Don't
  - Use any type without explicit justification
  - Read or write across tenant boundaries
  - Commit secrets or rely on real provider calls in tests
  - Modify Convex schema without a migration plan and human approval
  - Introduce external AI services; Ollama is the only inference engine

## 7. Tools & Dependencies

- Frameworks
  - Next.js (App Router), Convex backend
- Key libraries
  - zod for validation
  - @clerk/nextjs for auth
  - ESLint (Next + Convex plugin) and Prettier for formatting
- Commands
  - Install: pnpm install
  - Dev: pnpm dev (runs Next dev and convex dev in parallel)
  - Build: pnpm build; Start: pnpm start
  - Lint/Format: pnpm lint; npx prettier --write .
- Environment
  - Use .env.local and provide .env.local.example
  - Node 23+ required

## 8. Other Notes

- Follow AGENTS.md rigorously for write permissions and PR rules
- Never modify convex/schema.ts or migrations without an approved migration document
- Webhook handlers must verify provider signatures and Clerk JWTs where applicable
- Prefer typed, reusable helpers for signature verification and input parsing
- All new code must be production-ready, strongly typed, and accompanied by appropriate tests
