# Migration Plan: 0001 - Initial Schema

## Overview
This migration establishes the initial database schema for NoShowNinja, including all core tables for multi-tenant messaging, workflows, AI features, and analytics.

## Approval Required
**Human approval required** before applying this migration to production. Schema changes must be reviewed by engineering leads.

## Migration Details

### Table Creation Order
1. `tenants` - Foundation for tenant isolation
2. `users` - User management scoped to tenants
3. `contacts` - Customer data scoped to tenants
4. `workflows` - Workflow definitions
5. `workflowSteps` - Workflow step configurations
6. `templates` - Message templates
7. `scheduledMessages` - Message scheduling
8. `messageEvents` - Message delivery tracking
9. `aiPreviews` - AI generation previews
10. `ragDocuments` - RAG knowledge base
11. `counters` - Usage metrics (sharded)
12. `aggregates` - Analytics aggregates

### Indexes Created
- `tenants`: by_clerkOrgId
- `users`: by_tenantId, by_clerkUserId
- `contacts`: by_tenantId, by_phone, by_email
- `workflows`: by_tenantId
- `workflowSteps`: by_workflowId, by_tenantId
- `templates`: by_tenantId, by_channel
- `scheduledMessages`: by_tenantId, by_sendAt, by_status, by_contactId
- `messageEvents`: by_scheduledMessageId, by_tenantId, by_eventType
- `aiPreviews`: by_tenantId, by_expiresAt
- `ragDocuments`: by_tenantId
- `counters`: by_tenant_metric_shard
- `aggregates`: by_tenant_date_metric, by_tenant_period

### Performance Considerations
- Composite indexes on frequently filtered+queried fields (e.g., tenantId + status)
- Indexes on time-based fields for cron processing (sendAt, expiresAt)
- Sharded counters for high-throughput metrics

### Backward Compatibility
- No existing data to migrate
- All tables are new
- No destructive operations

### Rollback Plan
- If migration fails, drop all tables in reverse order
- No data loss risk since this is initial schema

### Testing Requirements
- Run migration against staging environment first
- Verify all indexes are created correctly
- Test basic CRUD operations on all tables
- Confirm tenant isolation queries work

### Post-Migration Tasks
- Register all Convex Components in `convex.config.ts`
- Update generated types
- Run full test suite

## Sign-off
- [ ] Engineering Lead Review
- [ ] Schema Design Approved
- [ ] Migration Script Reviewed
- [ ] Rollback Plan Approved