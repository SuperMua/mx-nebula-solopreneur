-- MX-星云一人公司 Database Schema
-- Generated from Drizzle ORM schema

-- ENUMS
DO $$ BEGIN
  CREATE TYPE tier AS ENUM ('free', 'pro', 'enterprise');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE agent_source AS ENUM ('translated', 'original');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE agent_status AS ENUM ('active', 'pending', 'rejected', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE execution_status AS ENUM ('pending', 'running', 'completed', 'failed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE node_status AS ENUM ('pending', 'running', 'completed', 'failed', 'skipped');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  display_name VARCHAR(200),
  bio TEXT,
  tier tier NOT NULL DEFAULT 'free',
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  subscription_status VARCHAR(30) DEFAULT 'inactive',
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tier ON users(tier);

-- SESSIONS
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- AGENTS
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(300) NOT NULL UNIQUE,
  name VARCHAR(300) NOT NULL,
  name_en VARCHAR(300),
  description TEXT NOT NULL,
  description_en TEXT,
  emoji VARCHAR(10),
  color VARCHAR(20),
  department VARCHAR(100) NOT NULL,
  department_label VARCHAR(100) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  content_md TEXT NOT NULL,
  frontmatter JSONB NOT NULL DEFAULT '{}',
  source agent_source NOT NULL DEFAULT 'translated',
  tags JSONB DEFAULT '[]',
  platforms JSONB DEFAULT '[]',
  game_engines JSONB DEFAULT '[]',
  supported_tools JSONB DEFAULT '[]',
  version VARCHAR(20) DEFAULT '1.0.0',
  is_community BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID REFERENCES users(id),
  status agent_status NOT NULL DEFAULT 'active',
  download_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  avg_rating NUMERIC(3,2),
  rating_count INTEGER NOT NULL DEFAULT 0,
  synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_agents_department ON agents(department);
CREATE INDEX IF NOT EXISTS idx_agents_source ON agents(source);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_slug ON agents(slug);

-- WORKFLOWS
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  dag_json JSONB NOT NULL DEFAULT '{"nodes": [], "edges": []}',
  thumbnail_url VARCHAR(500),
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_workflows_user ON workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_workflows_public ON workflows(is_public) WHERE is_public = true;

-- WORKFLOW EXECUTIONS
CREATE TABLE IF NOT EXISTS workflow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status execution_status NOT NULL DEFAULT 'pending',
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  dag_snapshot JSONB NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  duration_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_executions_workflow ON workflow_executions(workflow_id);
CREATE INDEX IF NOT EXISTS idx_executions_user ON workflow_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_executions_status ON workflow_executions(status);

-- WORKFLOW NODE EXECUTIONS
CREATE TABLE IF NOT EXISTS workflow_node_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  execution_id UUID NOT NULL REFERENCES workflow_executions(id) ON DELETE CASCADE,
  node_id VARCHAR(100) NOT NULL,
  agent_id UUID REFERENCES agents(id),
  agent_slug VARCHAR(300) NOT NULL,
  status node_status NOT NULL DEFAULT 'pending',
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  duration_ms INTEGER,
  retry_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_node_executions_exec ON workflow_node_executions(execution_id);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL,
  title VARCHAR(300),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_agent ON reviews(agent_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_user_agent ON reviews(user_id, agent_id);

-- FAVORITES
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_favorites_user_agent ON favorites(user_id, agent_id);

-- USAGE RECORDS
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  execution_count INTEGER NOT NULL DEFAULT 0,
  workflow_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_usage_user_date ON usage_records(user_id, date);
CREATE UNIQUE INDEX IF NOT EXISTS idx_usage_user_date_unique ON usage_records(user_id, date);

-- SUBSCRIPTION PLANS
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier tier NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  price_monthly NUMERIC(10,2) NOT NULL,
  price_yearly NUMERIC(10,2) NOT NULL,
  features JSONB NOT NULL DEFAULT '{}',
  max_workflows INTEGER NOT NULL,
  max_executions_per_month INTEGER NOT NULL,
  stripe_price_id_monthly VARCHAR(255),
  stripe_price_id_yearly VARCHAR(255),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SYNC LOGS
CREATE TABLE IF NOT EXISTS agent_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'running',
  agents_added INTEGER NOT NULL DEFAULT 0,
  agents_updated INTEGER NOT NULL DEFAULT 0,
  agents_removed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  repo_commit_sha VARCHAR(40),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- API KEYS
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  key_prefix VARCHAR(10) NOT NULL,
  scopes JSONB NOT NULL DEFAULT '[]',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys(user_id);
