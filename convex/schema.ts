import { defineSchema, defineTable } from "convex/server";

export default defineSchema({
  tenants: defineTable({
    name: "string",
    plan: "string?",
    clerkUserId: "string?",
    createdAt: "number",
  }),
  users: defineTable({
    clerkUserId: "string",
    tenantId: "string?", // id("tenants")
    role: "string", // default: "user"
    createdAt: "number",
  }),
  contacts: defineTable({
    tenantId: "string", // id("tenants")
    firstName: "string?",
    lastName: "string?",
    phone: "string?",
    email: "string?",
    metadata: "any?",
    createdAt: "number",
  }),
  workflows: defineTable({
    tenantId: "string", // id("tenants")
    name: "string",
    description: "string?",
    createdAt: "number",
  }),
  workflowSteps: defineTable({
    workflowId: "string", // id("workflows")
    tenantId: "string", // id("tenants")
    order: "number",
    channel: "string",
    delaySeconds: "number", // default: 0
    templateId: "string?", // id("templates")
    useAi: "boolean", // default: false
  }),
  templates: defineTable({
    tenantId: "string", // id("tenants")
    name: "string",
    body: "string",
    channel: "string",
    createdAt: "number",
  }),
  scheduledMessages: defineTable({
    tenantId: "string", // id("tenants")
    contactId: "string", // id("contacts")
    workflowStepId: "string?", // id("workflowSteps")
    sendAt: "number",
    payload: "any?",
    status: "string", // default: "scheduled"
    createdAt: "number",
  }),
  messageEvents: defineTable({
    tenantId: "string", // id("tenants")
    scheduledMessageId: "string?", // id("scheduledMessages")
    provider: "string?",
    providerMessageId: "string?",
    status: "string",
    raw: "any?",
    createdAt: "number",
  }),
  aiPreviews: defineTable({
    tenantId: "string", // id("tenants")
    userId: "string?", // id("users")
    prompt: "string",
    tokens: "string?",
    status: "string", // default: "pending"
    createdAt: "number",
  }),
  ragDocuments: defineTable({
    tenantId: "string", // id("tenants")
    title: "string?",
    text: "string",
    metadata: "any?",
    createdAt: "number",
  }),
  // Add metrics/aggregate tables as needed
});
