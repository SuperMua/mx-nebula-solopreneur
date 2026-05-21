import { eq, sql } from 'drizzle-orm'
import db from '../utils/db'
import { agents, agentSyncLogs } from '../db/schema'

const REPO_URL = 'https://github.com/jnMetaCode/agency-agents-zh'
const RAW_BASE = 'https://raw.githubusercontent.com/jnMetaCode/agency-agents-zh/main'

// Map file paths to departments
function inferDepartment(filePath: string): { department: string; label: string } {
  const map: Record<string, { department: string; label: string }> = {
    engineering: { department: 'engineering', label: '工程部' },
    design: { department: 'design', label: '设计部' },
    marketing: { department: 'marketing', label: '营销部' },
    'paid-media': { department: 'paid-media', label: '付费媒体部' },
    sales: { department: 'sales', label: '销售部' },
    finance: { department: 'finance', label: '金融部' },
    hr: { department: 'hr', label: '人力资源部' },
    legal: { department: 'legal', label: '法务部' },
    'supply-chain': { department: 'supply-chain', label: '供应链部' },
    product: { department: 'product', label: '产品部' },
    'project-management': { department: 'project-management', label: '项目管理部' },
    testing: { department: 'testing', label: '测试部' },
    support: { department: 'support', label: '支持部' },
    specialized: { department: 'specialized', label: '专项部' },
    'spatial-computing': { department: 'spatial-computing', label: '空间计算部' },
    'game-development': { department: 'game-development', label: '游戏开发部' },
    academic: { department: 'academic', label: '学术部' },
    strategy: { department: 'strategy', label: '战略部' },
  }

  const prefix = filePath.split('/')[0]
  return map[prefix] || { department: prefix, label: prefix }
}

// Parse YAML frontmatter from markdown
function parseFrontmatter(content: string): {
  data: Record<string, any>
  body: string
} {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/)
  if (!match) {
    return { data: {}, body: content }
  }

  const yamlBlock = match[1]
  const body = match[2]

  const data: Record<string, any> = {}
  for (const line of yamlBlock.split('\n')) {
    const kv = line.match(/^(\w[\w-]*):\s*(.+)$/)
    if (kv) {
      const key = kv[1].trim()
      let value: any = kv[2].trim()
      // Unquote
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      // Parse arrays: [a, b, c]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map((s: string) => s.trim().replace(/['"]/g, ''))
      }
      data[key] = value
    }
  }

  return { data, body }
}

// Parse AGENT-LIST.md to get source info (translated vs original)
async function fetchAgentList(): Promise<Map<string, string>> {
  const sourceMap = new Map<string, string>()
  try {
    const response = await fetch(`${RAW_BASE}/AGENT-LIST.md`)
    const text = await response.text()

    // Parse markdown tables
    // Lines matching: | `file.md` | Name | Description | ... |
    const rows = text.split('\n').filter(line => line.match(/^\|.*\|.*\|/))
    for (const row of rows) {
      const cols = row.split('|').map(c => c.trim()).filter(Boolean)
      if (cols.length >= 2 && cols[0].includes('.md')) {
        const filename = cols[0].replace(/`/g, '')
        // Check for ⭐ marker indicating original Chinese agent
        const isOriginal = row.includes('⭐')
        sourceMap.set(filename, isOriginal ? 'original' : 'translated')
      }
    }
  } catch {
    // If can't fetch AGENT-LIST.md, all agents default to 'translated'
  }
  return sourceMap
}

// Known list of all 215 agent files (from the repo structure)
const ALL_AGENT_FILES = [
  // Engineering
  'engineering/engineering-frontend-developer.md',
  'engineering/engineering-backend-architect.md',
  'engineering/engineering-ai-engineer.md',
  'engineering/engineering-devops-automator.md',
  'engineering/engineering-security-engineer.md',
  'engineering/engineering-rapid-prototyper.md',
  'engineering/engineering-senior-developer.md',
  'engineering/engineering-mobile-app-builder.md',
  'engineering/engineering-data-engineer.md',
  'engineering/engineering-technical-writer.md',
  'engineering/engineering-autonomous-optimization-architect.md',
  'engineering/engineering-embedded-firmware-engineer.md',
  'engineering/engineering-pc-host-engineer.md',
  'engineering/engineering-mechanical-design-engineer.md',
  'engineering/engineering-embedded-linux-driver-engineer.md',
  'engineering/engineering-fpga-digital-design-engineer.md',
  'engineering/engineering-iot-solution-architect.md',
  'engineering/engineering-incident-response-commander.md',
  'engineering/engineering-threat-detection-engineer.md',
  'engineering/engineering-solidity-smart-contract-engineer.md',
  'engineering/engineering-wechat-mini-program-developer.md',
  'engineering/engineering-code-reviewer.md',
  'engineering/engineering-database-optimizer.md',
  'engineering/engineering-git-workflow-master.md',
  'engineering/engineering-software-architect.md',
  'engineering/engineering-sre.md',
  'engineering/engineering-ai-data-remediation-engineer.md',
  'engineering/engineering-feishu-integration-developer.md',
  'engineering/engineering-dingtalk-integration-developer.md',
  'engineering/engineering-cms-developer.md',
  'engineering/engineering-email-intelligence-engineer.md',
  'engineering/engineering-filament-optimization-specialist.md',
  'engineering/engineering-codebase-onboarding-engineer.md',
  'engineering/engineering-minimal-change-engineer.md',
  'engineering/engineering-voice-ai-integration-engineer.md',
  // Design
  'design/design-ui-designer.md',
  'design/design-ux-researcher.md',
  'design/design-ux-architect.md',
  'design/design-brand-guardian.md',
  'design/design-image-prompt-engineer.md',
  'design/design-visual-storyteller.md',
  'design/design-whimsy-injector.md',
  'design/design-inclusive-visuals-specialist.md',
  // Marketing
  'marketing/marketing-xiaohongshu-operator.md',
  'marketing/marketing-douyin-strategist.md',
  'marketing/marketing-wechat-operator.md',
  'marketing/marketing-bilibili-strategist.md',
  'marketing/marketing-kuaishou-strategist.md',
  'marketing/marketing-china-ecommerce-operator.md',
  'marketing/marketing-ecommerce-operator.md',
  'marketing/marketing-baidu-seo-specialist.md',
  'marketing/marketing-private-domain-operator.md',
  'marketing/marketing-livestream-commerce-coach.md',
  'marketing/marketing-cross-border-ecommerce.md',
  'marketing/marketing-short-video-editing-coach.md',
  'marketing/marketing-weibo-strategist.md',
  'marketing/marketing-podcast-strategist.md',
  'marketing/marketing-weixin-channels-strategist.md',
  'marketing/marketing-knowledge-commerce-strategist.md',
  'marketing/marketing-xiaohongshu-specialist.md',
  'marketing/marketing-wechat-official-account.md',
  'marketing/marketing-zhihu-strategist.md',
  'marketing/marketing-china-market-localization-strategist.md',
  'marketing/marketing-daily-news-briefing.md',
  'marketing/marketing-tiktok-strategist.md',
  'marketing/marketing-twitter-engager.md',
  'marketing/marketing-instagram-curator.md',
  'marketing/marketing-reddit-community-builder.md',
  'marketing/marketing-app-store-optimizer.md',
  'marketing/marketing-video-optimization-specialist.md',
  'marketing/marketing-growth-hacker.md',
  'marketing/marketing-content-creator.md',
  'marketing/marketing-social-media-strategist.md',
  'marketing/marketing-seo-specialist.md',
  'marketing/marketing-carousel-growth-engine.md',
  'marketing/marketing-linkedin-content-creator.md',
  'marketing/marketing-book-co-author.md',
  'marketing/marketing-ai-citation-strategist.md',
  'marketing/marketing-agentic-search-optimizer.md',
]

const MORE_AGENT_FILES = [
  // Paid media
  'paid-media/paid-media-auditor.md',
  'paid-media/paid-media-creative-strategist.md',
  'paid-media/paid-media-paid-social-strategist.md',
  'paid-media/paid-media-ppc-strategist.md',
  'paid-media/paid-media-programmatic-buyer.md',
  'paid-media/paid-media-search-query-analyst.md',
  'paid-media/paid-media-tracking-specialist.md',
  // Sales
  'sales/sales-account-strategist.md',
  'sales/sales-coach.md',
  'sales/sales-deal-strategist.md',
  'sales/sales-discovery-coach.md',
  'sales/sales-engineer.md',
  'sales/sales-outbound-strategist.md',
  'sales/sales-pipeline-analyst.md',
  'sales/sales-proposal-strategist.md',
  // Finance
  'finance/finance-financial-forecaster.md',
  'finance/finance-invoice-manager.md',
  'finance/finance-fraud-detector.md',
  'finance/finance-bookkeeper-controller.md',
  'finance/finance-financial-analyst.md',
  'finance/finance-fpa-analyst.md',
  'finance/finance-investment-researcher.md',
  'finance/finance-tax-strategist.md',
  // HR
  'hr/hr-recruiter.md',
  'hr/hr-performance-reviewer.md',
  // Legal
  'legal/legal-contract-reviewer.md',
  'legal/legal-policy-writer.md',
  // Supply chain
  'supply-chain/supply-chain-inventory-forecaster.md',
  'supply-chain/supply-chain-vendor-evaluator.md',
  'supply-chain/supply-chain-route-optimizer.md',
  'supply-chain/supply-chain-strategist.md',
  // Product
  'product/product-sprint-prioritizer.md',
  'product/product-trend-researcher.md',
  'product/product-feedback-synthesizer.md',
  'product/product-behavioral-nudge-engine.md',
  'product/product-manager.md',
  // Project management
  'project-management/project-manager-senior.md',
  'project-management/project-management-project-shepherd.md',
  'project-management/project-management-experiment-tracker.md',
  'project-management/project-management-studio-producer.md',
  'project-management/project-management-studio-operations.md',
  'project-management/project-management-jira-workflow-steward.md',
  // Testing
  'testing/testing-evidence-collector.md',
  'testing/testing-reality-checker.md',
  'testing/testing-api-tester.md',
  'testing/testing-performance-benchmarker.md',
  'testing/testing-accessibility-auditor.md',
  'testing/testing-test-results-analyzer.md',
  'testing/testing-tool-evaluator.md',
  'testing/testing-workflow-optimizer.md',
  'testing/testing-embedded-qa-engineer.md',
  // Support
  'support/support-support-responder.md',
  'support/support-analytics-reporter.md',
  'support/support-legal-compliance-checker.md',
  'support/support-executive-summary-generator.md',
  'support/support-finance-tracker.md',
  'support/support-infrastructure-maintainer.md',
  'support/support-recruitment-specialist.md',
  // Specialized
  'specialized/agents-orchestrator.md',
  'specialized/prompt-engineer.md',
  'specialized/agentic-identity-trust.md',
  'specialized/data-consolidation-agent.md',
  'specialized/lsp-index-engineer.md',
  'specialized/report-distribution-agent.md',
  'specialized/sales-data-extraction-agent.md',
  'specialized/compliance-auditor.md',
  'specialized/accounts-payable-agent.md',
  'specialized/identity-graph-operator.md',
  'specialized/specialized-cultural-intelligence-strategist.md',
  'specialized/specialized-developer-advocate.md',
  'specialized/specialized-model-qa.md',
  'specialized/zk-steward.md',
  'specialized/blockchain-security-auditor.md',
  'specialized/study-abroad-advisor.md',
  'specialized/government-digital-presales-consultant.md',
  'specialized/corporate-training-designer.md',
  'specialized/specialized-mcp-builder.md',
  'specialized/specialized-document-generator.md',
  'specialized/specialized-workflow-architect.md',
  'specialized/automation-governance-architect.md',
  'specialized/specialized-salesforce-architect.md',
  'specialized/healthcare-marketing-compliance.md',
  'specialized/gaokao-college-advisor.md',
  'specialized/specialized-pricing-optimizer.md',
  'specialized/specialized-ai-policy-writer.md',
  'specialized/specialized-risk-assessor.md',
  'specialized/specialized-meeting-assistant.md',
  'specialized/specialized-civil-engineer.md',
  'specialized/specialized-french-consulting-market.md',
  'specialized/specialized-korean-business-navigator.md',
  'specialized/recruitment-specialist.md',
  'specialized/technical-translator-agent.md',
  'specialized/healthcare-customer-service.md',
  'specialized/hospitality-guest-services.md',
  'specialized/hr-onboarding.md',
  'specialized/language-translator.md',
  'specialized/legal-billing-time-tracking.md',
  'specialized/legal-client-intake.md',
  'specialized/legal-document-review.md',
  'specialized/livestock-archive-auditor.md',
  'specialized/loan-officer-assistant.md',
  // Spatial computing
  'spatial-computing/visionos-spatial-engineer.md',
  'spatial-computing/macos-spatial-metal-engineer.md',
  'spatial-computing/xr-interface-architect.md',
  'spatial-computing/xr-immersive-developer.md',
  'spatial-computing/xr-cockpit-interaction-specialist.md',
  'spatial-computing/terminal-integration-specialist.md',
  // Game dev
  'game-development/game-designer.md',
  'game-development/level-designer.md',
  'game-development/narrative-designer.md',
  'game-development/technical-artist.md',
  'game-development/game-audio-engineer.md',
  'game-development/unity/unity-architect.md',
  'game-development/unity/unity-editor-tool-developer.md',
  'game-development/unity/unity-multiplayer-engineer.md',
  'game-development/unity/unity-shader-graph-artist.md',
  'game-development/unreal-engine/unreal-multiplayer-architect.md',
  'game-development/unreal-engine/unreal-systems-engineer.md',
  'game-development/unreal-engine/unreal-technical-artist.md',
  'game-development/unreal-engine/unreal-world-builder.md',
  'game-development/blender/blender-addon-engineer.md',
  'game-development/godot/godot-gameplay-scripter.md',
  'game-development/godot/godot-multiplayer-engineer.md',
  'game-development/godot/godot-shader-developer.md',
  'game-development/roblox-studio/roblox-avatar-creator.md',
  'game-development/roblox-studio/roblox-experience-designer.md',
  'game-development/roblox-studio/roblox-systems-scripter.md',
  // Academic
  'academic/academic-anthropologist.md',
  'academic/academic-geographer.md',
  'academic/academic-historian.md',
  'academic/academic-narratologist.md',
  'academic/academic-psychologist.md',
  'academic/academic-study-planner.md',
]

const ALL_FILES = [...ALL_AGENT_FILES, ...MORE_AGENT_FILES]

export async function syncAgents(trigger: 'webhook' | 'cron' | 'manual' = 'manual') {
  const log = await db.insert(agentSyncLogs).values({
    trigger,
    status: 'running',
  }).returning({ id: agentSyncLogs.id })

  const logId = log[0].id
  let added = 0
  let updated = 0
  let removed = 0

  try {
    const sourceMap = await fetchAgentList()

    for (const filePath of ALL_FILES) {
      try {
        const url = `${RAW_BASE}/${filePath}`
        const response = await fetch(url)

        if (!response.ok) {
          console.warn(`Failed to fetch ${filePath}: ${response.status}`)
          continue
        }

        const content = await response.text()
        const { data: frontmatter, body } = parseFrontmatter(content)

        const departmentInfo = inferDepartment(filePath)
        const slug = filePath.replace(/\//g, '-').replace('.md', '')

        // Determine source (translated vs original)
        const source = sourceMap.get(filePath) || 'translated'

        // Extract supported tools from frontmatter or content
        const supportedTools = frontmatter.supported_tools || frontmatter.tools || []

        const agentData = {
          slug,
          name: frontmatter.name || slug,
          nameEn: frontmatter.name_en || null,
          description: frontmatter.description || '',
          descriptionEn: frontmatter.description_en || null,
          emoji: frontmatter.emoji || null,
          color: frontmatter.color || null,
          department: departmentInfo.department,
          departmentLabel: departmentInfo.label,
          filePath,
          contentMd: body || content,
          frontmatter: frontmatter as any,
          source: source as 'translated' | 'original',
          tags: frontmatter.tags || [],
          platforms: frontmatter.platforms || [],
          supportedTools,
          syncedAt: new Date(),
        }

        // Upsert
        const existing = await db.select({ id: agents.id }).from(agents).where(eq(agents.slug, slug)).limit(1)

        if (existing.length > 0) {
          await db.update(agents).set(agentData).where(eq(agents.slug, slug))
          updated++
        } else {
          await db.insert(agents).values(agentData)
          added++
        }
      } catch (err) {
        console.error(`Error syncing agent ${filePath}:`, err)
      }
    }

    await db.update(agentSyncLogs).set({
      status: 'completed',
      agentsAdded: added,
      agentsUpdated: updated,
      agentsRemoved: removed,
      completedAt: new Date(),
    }).where(eq(agentSyncLogs.id, logId))

    return { added, updated, removed }
  } catch (err: any) {
    await db.update(agentSyncLogs).set({
      status: 'completed',
      errorMessage: err.message,
      completedAt: new Date(),
    }).where(eq(agentSyncLogs.id, logId))

    throw err
  }
}
