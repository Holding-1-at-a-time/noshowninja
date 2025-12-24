# NoShowNinja README

## Project Overview
**NoShowNinja** is an AI powered follow‑up and reminder platform for service businesses. It automates SMS and email reminders, personalizes messages with tenant‑specific RAG context, and schedules reliable sends to reduce no‑shows and recover revenue. This repository contains the Next.js App Router frontend, Convex backend functions and schema, and integrations for Clerk, Ollama, Twilio, Resend, and Stripe.

## Quick Start
**Prerequisites**
- Node 18+ and npm
- Convex CLI and account
- Clerk account and API keys
- Ollama server or accessible Ollama endpoint
- Twilio account and phone number
- Resend account for email
- Stripe account for billing

**Install and run locally**
```bash
npm install
# start Convex dev and Next.js together if configured
npm run dev
# or run frontend and backend separately
npm run dev:frontend
npm run dev:backend
```

## Environment Variables
Create a `.env.local` file from `.env.local.example` and populate the keys below.

**Required keys**
```
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
OLLAma_API_URL=
OLLAma_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

**Notes**
- Keep secrets out of source control.
- Use separate keys for staging and production.

## Convex Components and Backend
**Core Convex artifacts**
- `convex/schema.ts` defines tenants, contacts, workflows, steps, templates, scheduledMessages, messageEvents, aiPreviews.
- `convex/convex.config.ts` registers Convex Components used by the platform.

**Convex Components used**
- **AI Agent** for orchestrating generation and threads.
- **RAG** for tenant knowledge ingestion and retrieval.
- **Persistent Text Streaming** for tokenized AI previews.
- **Twilio SMS** component for outbound and inbound SMS.
- **Resend** component for transactional email.
- **Rate Limiter** and **Action Cache** for safety and performance.
- **Workpool**, **Workflow**, and **Action Retrier** for durable task processing.
- **Migrations**, **Aggregate**, and **Sharded Counter** for schema evolution and analytics.

**Key backend entry points**
- `convex/auth.ts` tenant mapping and auth helpers.
- `convex/workflows.ts` workflow CRUD.
- `convex/ai/*` Ollama integration, RAG ingestion, preview streaming.
- `convex/send.ts` provider abstraction and send pipeline.
- `convex/crons.ts` scheduled processing and aggregates.

## Development Workflow and Scripts
**Common scripts**
```bash
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
npm run lint
npm run test
```

**Testing**
- Unit test Convex functions with mocked providers.
- E2E tests simulate onboarding to send flows with provider mocks.
- Run tests in CI on every PR.

**CI and Deployment**
- CI runs lint, tests, and build.
- Deploy frontend to Vercel and Convex functions via Convex deploy.
- Use environment specific secrets for staging and production.

## Contributing and Next Steps
**How to contribute**
- Work from the Tasks list in the project board.
- Open small PRs that implement a single task and include tests.
- Reference task IDs in PR descriptions for traceability.

**Next recommended tasks**
- Initialize Convex schema and register components.
- Implement tenant mapping with Clerk.
- Build the dashboard shell and workflow CRUD.
- Wire Ollama generation and streaming preview.

**License**
- **MIT License** by default. Update if your organization requires a different license.

I can scaffold the initial Convex components and code stubs for the top priority tasks—reply with the single word `scaffold` to start generating those files and stubs.