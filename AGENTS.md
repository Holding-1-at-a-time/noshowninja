# AGENTS.md

This file defines how automated agents should operate within the **NoShowNinja** repository. It gives clear, actionable rules for agents that generate docs, tests, API routes, deployments, and other automation. Follow these instructions exactly to keep agents safe, predictable, and useful.

---

### Codebase Navigation and Architecture

**Purpose:** Help agents understand where to read and where to write.

- **Project root layout**
  - `app/` — Next.js App Router frontend (read only for most agents).  
  - `components/` — UI primitives (read only).  
  - `convex/` — backend functions, schema, Convex Components (read for docs and tests; write only with explicit permission).  
  - `public/` — static assets (read only).  
  - `docs/` — documentation output (agents may write here).  
  - `tests/` — test files and fixtures (agents may write here).  
  - `infra/` — deployment scripts, Dockerfile, CI workflows (dev deploy agent may write here).  
  - `.github/workflows/` — CI and deploy pipelines (dev deploy agent may modify with approval).

- **Read vs Write rules**
  - **Read everywhere.** Agents may analyze any file to produce outputs.  
  - **Write only to designated folders:** `docs/`, `tests/`, `infra/`, `.github/workflows/` (see agent-specific boundaries below).  
  - **Never modify** `app/` or `components/` unless an agent is explicitly authorized to change API routes under `app/api/`.  
  - **Schema changes:** Any change to `convex/schema.ts` or other Convex schema files **requires explicit human approval** and a documented migration plan.

---

### Code Styles and Formatting

**Purpose:** Keep code consistent and machine‑readable.

- **TypeScript rules**
  - **Strict mode enabled.** No `any` unless approved and documented.  
  - Use explicit return types for exported functions.  
- **Formatting tools**
  - **Prettier** for formatting. Run:  

    ```bash
    npx prettier --write .
    ```

  - **ESLint** for linting. Run:  

    ```bash
    npm run lint
    ```

- **Tailwind and UI**
  - Use Tailwind utility classes for layout and spacing. Prefer `shadcn/ui` primitives for accessible components.
- **Agent behavior**
  - Agents that auto‑fix style may run formatters and linters with `--fix`. They must not change logic when applying fixes.

---

### Test Protocols

**Purpose:** Ensure tests are reliable, isolated, and safe.

- **Where tests live**
  - `tests/unit/` — unit tests for Convex functions and helpers.  
  - `tests/integration/` — integration tests that may run against local Convex dev.  
  - `tests/e2e/` — Playwright tests for critical user flows.
- **Agent permissions**
  - **Allowed:** Create and update tests and fixtures under `tests/`.  
  - **Forbidden:** Modify source code to make tests pass. If a test fails due to implementation, open an issue or PR for human review.
- **Mocking and isolation**
  - Unit tests must mock external providers (Twilio, Resend, Ollama, Stripe).  
  - Integration tests may use `npx convex dev` and seeded fixtures; they must clean up after themselves.
- **Commands**
  - Run unit tests:  

    ```bash
    npm test
    ```

  - Run Playwright:  

    ```bash
    npx playwright test
    ```

---

### Build Process and Environment Settings

**Purpose:** Standardize local dev and staging builds.

- **Local dev**
  - Install and run:  

    ```bash
    npm install
    npm run dev
    npx convex dev
    ```

- **Environment variables**
  - Use `.env.local` for local secrets. Provide `.env.local.example` with keys and descriptions. Never commit real secrets.
- **Staging and dev deploys**
  - Dev deploy agent may update `infra/` and `.github/workflows/` for staging. Production deploys require explicit human approval.
- **Docker**
  - Dev Dockerfile allowed in `infra/`. Build command:  

    ```bash
    docker build -t noshowninja-dev:latest .
    ```

---

### Commit Message Conventions

**Purpose:** Keep history readable and automatable.

- **Format**
  - Use conventional commits style:  

    ```
    type(scope): short summary
    ```

  - **Types:** `feat`, `fix`, `chore`, `docs`, `test`, `ci`, `refactor`, `perf`.
- **Examples**
  - `feat(workflow): add step ordering API`
  - `fix(send): handle Twilio transient errors`
- **Agent behavior**
  - Agents that create commits must follow this format and include a short description of the change and the task ID.

---

### Pull Request Instructions

**Purpose:** Ensure PRs are reviewable and safe.

- **PR template**
  - Summary of change, related task IDs, testing steps, and any required environment variables.
- **Required checks**
  - Lint, typecheck, unit tests, and CI must pass before merge.
- **Reviewers**
  - Assign at least one backend and one frontend reviewer for cross-cutting changes.
- **Agent behavior**
  - Agents may open PRs for generated docs, tests, or infra changes. For any PR that touches `convex/` schema or production deploys, require human approval and an explicit migration plan.

---

### Overall Project Guidelines

**Purpose:** High level rules for agents and contributors.

- **Tenant isolation**
  - All Convex functions must accept and validate `tenantId`. No cross‑tenant reads or writes.
- **Security**
  - Do not log secrets. Validate provider signatures for webhooks. Respect opt‑out and suppression lists.
- **AI usage**
  - Ollama is the required inference engine. Cache AI outputs where appropriate and avoid repeated identical calls.
- **Reliability**
  - Implement retries with exponential backoff for transient failures. Use Action Retrier and Workpool patterns in Convex.

---

### Review Checklist

**Purpose:** Quick checklist for reviewing agent generated code.

- **General**
  - Does the change follow commit message conventions  
  - Are lint and typecheck passing
- **Security**
  - No secrets committed  
  - Webhook signatures validated
- **Data safety**
  - Tenant scoping enforced  
  - No cross‑tenant access
- **Tests**
  - Unit tests added for new logic  
  - Integration or E2E tests added if behavior affects flows
- **Docs**
  - New public APIs documented in `docs/`
- **Schema**
  - Any schema change has an associated migration plan and explicit approval

---

### Customization Tips

**Purpose:** How to adapt AGENTS.md for subdirectories.

- **Per‑area AGENTS.md**
  - Create `frontend/AGENTS.md` for UI conventions and `backend/AGENTS.md` for Convex specifics. Keep root AGENTS.md authoritative for cross‑cutting rules.
- **Evolving rules**
  - Update AGENTS.md when introducing new components (e.g., a new Convex Component). Record the change in `docs/changes.md`.

---

### Leveraging Scopes

**Purpose:** Limit agent impact by scoping write permissions.

- **Scope examples**
  - `docs-agent` → write `docs/` only.  
  - `test-agent` → write `tests/` only.  
  - `api-agent` → write `app/api/` and `lib/providers/` helpers; must ask before schema changes.  
  - `dev-deploy-agent` → write `infra/` and `.github/workflows/`; require approval for staging deploys.
- **Enforcement**
  - Agents must declare their scope in PR descriptions and include a list of files they modified.

---

### Phased Implementation

**Purpose:** Roll out agent capabilities gradually.

- **Phase 1**
  - Enable read‑only agents: docs generation and static analysis.  
- **Phase 2**
  - Allow test and lint agents to write to `tests/` and apply safe formatting fixes.  
- **Phase 3**
  - Enable API and deploy agents with strict approval gates for schema and staging changes.  
- **Phase 4**
  - Expand to advanced automation (RAG ingestion helpers, AI tuning) after operational maturity.

---

### Regular Updates

**Purpose:** Keep AGENTS.md current.

- Review AGENTS.md every sprint or after major architectural changes.  
- Record updates in `docs/changes.md` with rationale and date.

---

### Best Practices

- **Be explicit.** Agents must have concrete commands and clear file boundaries.  
- **Prefer small changes.** Agents should create small, reviewable PRs.  
- **Validate outputs.** Agents must run validation commands (lint, tests, docs build) before opening PRs.  
- **Fail safe.** If an agent is uncertain about a risky change, it must open a draft PR and request human review.

---

### Future Considerations

- **AI helpers.** Use Ollama for AI calls and cache outputs.  
- **Security.** Validate webhook signatures.  
- **Data safety.** Enforce tenant isolation.  
- **Reliability.** Implement retries and backoff.  
- **Automation.** Use Action Retrier and Workpool patterns.

---