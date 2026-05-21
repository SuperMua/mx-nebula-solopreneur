import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  smallint,
  date,
  uniqueIndex,
  index,
  pgEnum,
  check,
  primaryKey,
} from 'drizzle-orm/pg-core'

// ============================================================
// ENUMS
// ============================================================
export const tierEnum = pgEnum('tier', ['free', 'pro', 'enterprise'])
export const agentSourceEnum = pgEnum('agent_source', ['translated', 'original'])
export const agentStatusEnum = pgEnum('agent_status', ['active', 'pending', 'rejected', 'archived'])
export const executionStatusEnum = pgEnum('execution_status', ['pending', 'running', 'completed', 'failed', 'cancelled'])
export const nodeStatusEnum = pgEnum('node_status', ['pending', 'running', 'completed', 'failed', 'skipped'])

// ============================================================
// USERS
// ============================================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  displayName: varchar('display_name', { length: 200 }),
  bio: text('bio'),
  tier: tierEnum('tier').notNull().default('free'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  subscriptionStatus: varchar('subscription_status', { length: 30 }).default('inactive'),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  tierIdx: index('idx_users_tier').on(table.tier),
}))

// ============================================================
// SESSIONS
// ============================================================
export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 500 }).notNull().unique(),
  refreshToken: varchar('refresh_token', { length: 500 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_sessions_user').on(table.userId),
  tokenIdx: index('idx_sessions_token').on(table.token),
}))

// ============================================================
// AGENTS
// ============================================================
export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  name: varchar('name', { length: 300 }).notNull(),
  nameEn: varchar('name_en', { length: 300 }),
  description: text('description').notNull(),
  descriptionEn: text('description_en'),
  emoji: varchar('emoji', { length: 10 }),
  color: varchar('color', { length: 20 }),
  department: varchar('department', { length: 100 }).notNull(),
  departmentLabel: varchar('department_label', { length: 100 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  contentMd: text('content_md').notNull(),
  frontmatter: jsonb('frontmatter').notNull().default({}),
  source: agentSourceEnum('source').notNull().default('translated'),
  tags: jsonb('tags').default([]),
  platforms: jsonb('platforms').default([]),
  gameEngines: jsonb('game_engines').default([]),
  supportedTools: jsonb('supported_tools').default([]),
  version: varchar('version', { length: 20 }).default('1.0.0'),
  isCommunity: boolean('is_community').notNull().default(false),
  submittedBy: uuid('submitted_by').references(() => users.id),
  status: agentStatusEnum('status').notNull().default('active'),
  downloadCount: integer('download_count').notNull().default(0),
  viewCount: integer('view_count').notNull().default(0),
  avgRating: numeric('avg_rating', { precision: 3, scale: 2 }),
  ratingCount: integer('rating_count').notNull().default(0),
  syncedAt: timestamp('synced_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  deptIdx: index('idx_agents_department').on(table.department),
  sourceIdx: index('idx_agents_source').on(table.source),
  statusIdx: index('idx_agents_status').on(table.status),
  slugIdx: index('idx_agents_slug').on(table.slug),
}))

// ============================================================
// WORKFLOWS
// ============================================================
export const workflows = pgTable('workflows', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 300 }).notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  dagJson: jsonb('dag_json').notNull().default({ nodes: [], edges: [] }),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  executionCount: integer('execution_count').notNull().default(0),
  lastExecutedAt: timestamp('last_executed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_workflows_user').on(table.userId),
  publicIdx: index('idx_workflows_public').on(table.isPublic).where(table.isPublic),
}))

// ============================================================
// EXECUTIONS
// ============================================================
export const workflowExecutions = pgTable('workflow_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  workflowId: uuid('workflow_id').notNull().references(() => workflows.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: executionStatusEnum('status').notNull().default('pending'),
  inputData: jsonb('input_data').default({}),
  outputData: jsonb('output_data').default({}),
  dagSnapshot: jsonb('dag_snapshot').notNull(),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  workflowIdx: index('idx_executions_workflow').on(table.workflowId),
  userIdx: index('idx_executions_user').on(table.userId),
  statusIdx: index('idx_executions_status').on(table.status),
}))

export const workflowNodeExecutions = pgTable('workflow_node_executions', {
  id: uuid('id').primaryKey().defaultRandom(),
  executionId: uuid('execution_id').notNull().references(() => workflowExecutions.id, { onDelete: 'cascade' }),
  nodeId: varchar('node_id', { length: 100 }).notNull(),
  agentId: uuid('agent_id').references(() => agents.id),
  agentSlug: varchar('agent_slug', { length: 300 }).notNull(),
  status: nodeStatusEnum('status').notNull().default('pending'),
  inputData: jsonb('input_data').default({}),
  outputData: jsonb('output_data').default({}),
  errorMessage: text('error_message'),
  durationMs: integer('duration_ms'),
  retryCount: integer('retry_count').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  execIdx: index('idx_node_executions_exec').on(table.executionId),
}))

// ============================================================
// REVIEWS
// ============================================================
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  rating: smallint('rating').notNull(),
  title: varchar('title', { length: 300 }),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  agentIdx: index('idx_reviews_agent').on(table.agentId),
  userAgentUnique: uniqueIndex('idx_reviews_user_agent').on(table.userId, table.agentId),
}))

// ============================================================
// FAVORITES
// ============================================================
export const favorites = pgTable('favorites', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: uuid('agent_id').notNull().references(() => agents.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_favorites_user').on(table.userId),
  userAgentUnique: uniqueIndex('idx_favorites_user_agent').on(table.userId, table.agentId),
}))

// ============================================================
// USAGE
// ============================================================
export const usageRecords = pgTable('usage_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  executionCount: integer('execution_count').notNull().default(0),
  workflowCount: integer('workflow_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userDateIdx: index('idx_usage_user_date').on(table.userId, table.date),
  userDateUnique: uniqueIndex('idx_usage_user_date_unique').on(table.userId, table.date),
}))

// ============================================================
// SUBSCRIPTION PLANS
// ============================================================
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  tier: tierEnum('tier').notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  priceMonthly: numeric('price_monthly', { precision: 10, scale: 2 }).notNull(),
  priceYearly: numeric('price_yearly', { precision: 10, scale: 2 }).notNull(),
  features: jsonb('features').notNull().default({}),
  maxWorkflows: integer('max_workflows').notNull(),
  maxExecutionsPerMonth: integer('max_executions_per_month').notNull(),
  stripePriceIdMonthly: varchar('stripe_price_id_monthly', { length: 255 }),
  stripePriceIdYearly: varchar('stripe_price_id_yearly', { length: 255 }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})

// ============================================================
// SYNC LOGS
// ============================================================
export const agentSyncLogs = pgTable('agent_sync_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  trigger: varchar('trigger', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('running'),
  agentsAdded: integer('agents_added').notNull().default(0),
  agentsUpdated: integer('agents_updated').notNull().default(0),
  agentsRemoved: integer('agents_removed').notNull().default(0),
  errorMessage: text('error_message'),
  repoCommitSha: varchar('repo_commit_sha', { length: 40 }),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
})

// ============================================================
// API KEYS
// ============================================================
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  keyHash: varchar('key_hash', { length: 255 }).notNull(),
  keyPrefix: varchar('key_prefix', { length: 10 }).notNull(),
  scopes: jsonb('scopes').notNull().default([]),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdx: index('idx_api_keys_user').on(table.userId),
}))
