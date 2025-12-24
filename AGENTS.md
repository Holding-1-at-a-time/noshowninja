AGENTS.md — NoShowNinja Automation Constitution
This document defines how automated agents must operate within the NoShowNinja repository.
Agents are powerful, but they must follow strict boundaries to keep the system safe, predictable, modular, and tenant‑isolated.

Agents must treat this file as law.
Human approval overrides agent behavior.

1. Codebase Navigation & Architecture
Project Layout
Agents must understand the structure and respect boundaries:

app/ — Next.js  App Router frontend (read‑only for most agents)

components/ — UI primitives (read‑only)

convex/ — backend logic, schema, Convex Components

read allowed

write only with explicit permission

public/ — static assets (read‑only)

docs/ — documentation (agents may write here)

tests/ — unit, integration, and E2E tests (agents may write here)

infra/ — deployment scripts, Dockerfiles, infra configs (dev‑deploy agent may write here)

.github/workflows/ — CI/CD pipelines (dev‑deploy agent may modify with approval)

Read vs Write Rules
Agents may read the entire repository.

Agents may write only to:

docs/

tests/

infra/

.github/workflows/

app/api/ (API‑agent only)

lib/providers/ (API‑agent only)

Schema Protection
Any modification to:

convex/schema.ts

convex/migrations/

Convex table definitions
requires explicit human approval + a migration plan.

Agents must never modify schema files without a migration document.

1. Code Style & Formatting
TypeScript Standards
Strict mode required

No any unless explicitly justified

All exported functions must have explicit return types

Prefer small, composable functions

Formatting
Agents may run:

bash
npx prettier --write .
npm run lint -- --fix
Agents must not change logic while fixing formatting.

UI Standards
Use Tailwind utility classes

Use shadcn/ui components

No agent may modify UI logic unless explicitly authorized

1. Test Protocols
Test Locations
tests/unit/ — Convex functions, helpers

tests/integration/ — Convex dev + seeded fixtures

tests/e2e/ — Playwright flows

Agent Permissions
Agents may create or update tests

Agents may not modify source code to make tests pass

If tests fail due to implementation, agents must:

Open an issue or

Open a PR with failing tests and request human review

Mocking Requirements
Unit tests must mock:

Twilio

Resend

Ollama

Stripe

Integration tests must clean up after themselves.

Commands
bash
npm test
npx playwright test
4. Build Process & Environment
Local Development
bash
npm install
npm run dev
npx convex dev
Environment Variables
Use .env.local

Provide .env.local.example

Never commit secrets

Deployments
Dev deploy agent may update infra/ and .github/workflows/

Production deploys require human approval

Docker
bash
docker build -t noshowninja-dev:latest .
5. Commit Message Conventions
Agents must use Conventional Commits:

Code
type(scope): short summary
Types:

feat

fix

chore

docs

test

ci

refactor

perf

Examples:

feat(workflow): add step ordering API

fix(send): handle Twilio transient errors

Agents must include:

A short description

A task ID (if applicable)

1. Pull Request Instructions
Every PR must include:

Summary of change

Related task IDs

Testing steps

Required environment variables

Migration notes (if schema touched)

Required Checks
Lint

Typecheck

Unit tests

CI pipeline

Reviewers
At least one backend reviewer

At least one frontend reviewer for cross‑cutting changes

Agent PR Rules
Agents may open PRs for:

Docs

Tests

Infra

API route scaffolding

Agents must not merge PRs

Schema‑touching PRs require:

Migration plan

Human approval

1. Project Guidelines
Tenant Isolation
All Convex functions must validate tenantId

No cross‑tenant reads or writes

AI, analytics, and messaging must be tenant‑scoped

Security
Validate webhook signatures (Twilio, Resend, Stripe)

Never log secrets

Respect opt‑out and suppression lists

AI Usage
Ollama is the only inference engine

AI outputs must be cached

RAG must be tenant‑scoped

No agent may introduce external AI services

Reliability
Use Action Retrier for transient failures

Use Workpool for durable tasks

Use sharded counters for metrics

Use daily aggregates for dashboards

1. Review Checklist
Agents must verify:

General
Commit message format correct

Lint + typecheck passing

Security
No secrets committed

Webhook signatures validated

Data Safety
Tenant scoping enforced

No cross‑tenant access

Tests
Unit tests added

Integration/E2E tests added if needed

Docs
Public APIs documented in docs/

Schema
Migration plan included

Human approval obtained

1. Customization Tips
Use frontend/AGENTS.md for UI‑specific rules

Use backend/AGENTS.md for Convex‑specific rules

Update AGENTS.md  when:

Adding new Convex Components

Changing architecture

Introducing new modules

Record changes in:

Code
docs/changes.md
10. Scopes & Permissions
Allowed Scopes
docs-agent → docs/

test-agent → tests/

api-agent → app/api/, lib/providers/

dev-deploy-agent → infra/, .github/workflows/

Enforcement
Agents must:

Declare scope in PR description

List modified files

Stay within allowed directories

1. Phased Implementation
Phase 1
Read‑only agents (docs, analysis)

Phase 2
Test + lint agents (safe writes)

Phase 3
API + deploy agents (restricted writes)

Phase 4
Advanced automation (RAG, AI tuning)

1. Regular Updates
Review AGENTS.md  every sprint

Update when architecture changes

Log changes in docs/changes.md

1. Best Practices
Be explicit

Prefer small PRs

Validate outputs

Fail safe: open draft PR when uncertain

1. Future Considerations
AI helpers via Ollama

Stronger schema migration tooling

Automated analytics aggregation

Provider‑agnostic messaging adapters

---
