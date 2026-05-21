<script setup lang="ts">
const route = useRoute()
const slug = computed(() => route.params.slug as string)

const { data, pending, error, refresh } = await useAsyncData(
  `agent-${slug.value}`,
  () => $fetch(`/api/v1/agents/${slug.value}`),
  { watch: [slug] }
)

const agent = computed(() => (data.value as any)?.data)
const related = computed(() => agent.value?.related || [])

const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'install', label: '安装指南' },
  { key: 'reviews', label: '评价' },
  { key: 'related', label: '相关 Agent' },
]

// Handle head metadata
useHead({
  title: agent.value ? `${agent.value.emoji || ''} ${agent.value.name} - MX-星云` : 'Agent 详情',
})

async function copyPrompt() {
  if (agent.value?.contentMd) {
    await navigator.clipboard.writeText(agent.value.contentMd)
    // Track copy
    $fetch(`/api/v1/agents/${slug.value}/copy`, { method: 'POST' }).catch(() => {})
  }
}

const copied = ref(false)
function onCopy() {
  copyPrompt()
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}
</script>

<template>
  <div class="page-section">
    <!-- Loading -->
    <div v-if="pending" class="max-w-4xl mx-auto">
      <div class="flex items-start gap-6 mb-12 animate-pulse">
        <div class="w-20 h-20 rounded-3xl bg-ink-muted/10 shrink-0" />
        <div class="flex-1">
          <div class="h-6 w-32 bg-ink-muted/10 rounded-full mb-3" />
          <div class="h-8 w-64 bg-ink-muted/10 rounded mb-2" />
          <div class="h-5 w-full bg-ink-muted/10 rounded" />
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-6xl mb-4">😵</p>
      <h3 class="text-xl font-semibold text-ink-heading mb-2">加载失败</h3>
      <p class="text-ink-muted mb-4">{{ error.message }}</p>
      <button @click="refresh()" class="btn-gradient text-sm">重试</button>
    </div>

    <!-- Agent Content -->
    <template v-else-if="agent">
      <!-- Hero -->
      <div class="max-w-4xl mx-auto mb-10">
        <div class="flex items-start gap-6">
          <div
            class="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-lg shrink-0"
            :style="{ background: `linear-gradient(135deg, ${agent.color || '#7C3AED'}20, ${agent.color || '#3B82F6'}15)` }"
          >
            {{ agent.emoji || '🤖' }}
          </div>
          <div>
            <div class="flex items-center gap-3 mb-2">
              <span :class="`dept-tag dept-tag--${agent.department}`">{{ agent.departmentLabel }}</span>
              <span v-if="agent.source === 'original'" class="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 font-medium">⭐ 中国原创</span>
              <span v-else class="text-xs px-2.5 py-1 rounded-full bg-sky-50 text-sky-600 font-medium">🌐 海外翻译</span>
            </div>
            <h1 class="text-3xl font-bold text-ink-heading mb-2">{{ agent.name }}</h1>
            <p class="text-lg text-ink-body">{{ agent.description }}</p>
            <div class="flex items-center gap-4 mt-3 text-sm text-ink-muted">
              <span v-if="agent.avgRating">⭐ {{ agent.avgRating }} ({{ agent.ratingCount }} 评价)</span>
              <span>👁 {{ agent.viewCount }} 次浏览</span>
              <span>📋 {{ agent.downloadCount }} 次复制</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="max-w-4xl mx-auto">
        <div class="flex gap-1 mb-6 border-b border-ink-muted/10">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-5 py-3 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'text-brand-violet border-b-2 border-brand-violet'
                : 'text-ink-muted hover:text-ink-body'
            ]"
          >{{ tab.label }}</button>
        </div>

        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
          <div v-if="agent.contentHtml" class="prose-content" v-html="agent.contentHtml"></div>
          <div v-else class="text-center py-12 text-ink-muted">暂无内容</div>
        </div>

        <!-- Install Tab -->
        <div v-if="activeTab === 'install'" class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
          <h3 class="font-semibold text-ink-heading text-xl mb-6">安装到你的 AI 工具</h3>

          <div class="space-y-6">
            <div class="p-5 rounded-2xl bg-surface-base border border-ink-muted/10">
              <h4 class="font-medium text-ink-heading mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-brand-violet/10 flex items-center justify-center text-xs">🟣</span>
                Claude Code
              </h4>
              <pre class="bg-ink-heading text-green-400 text-sm p-4 rounded-xl overflow-x-auto"><code># 下载 Agent 文件
curl -o {{ agent.slug }}.md {{ 'https://raw.githubusercontent.com/jnMetaCode/agency-agents-zh/main/' + agent.filePath }}

# 复制到 Claude Code agents 目录
cp {{ agent.slug }}.md ~/.claude/agents/

# 在 Claude Code 中激活
# "激活 {{ agent.name }} 模式"</code></pre>
            </div>

            <div class="p-5 rounded-2xl bg-surface-base border border-ink-muted/10">
              <h4 class="font-medium text-ink-heading mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-brand-sky/10 flex items-center justify-center text-xs">⬛</span>
                Cursor
              </h4>
              <pre class="bg-ink-heading text-green-400 text-sm p-4 rounded-xl overflow-x-auto"><code># 将以下内容添加到 .cursorrules 或在 Cursor Settings > Rules 中配置

# {{ agent.name }}
{{ agent.description }}

# 使用 {{ agent.emoji || '' }} {{ agent.name }} 作为 AI 角色</code></pre>
            </div>

            <div class="p-5 rounded-2xl bg-surface-base border border-ink-muted/10">
              <h4 class="font-medium text-ink-heading mb-3 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-brand-coral/10 flex items-center justify-center text-xs">🐙</span>
                GitHub Copilot
              </h4>
              <pre class="bg-ink-heading text-green-400 text-sm p-4 rounded-xl overflow-x-auto"><code># 在 VS Code 中打开 Copilot Chat，输入：
/system {{ agent.name }} 角色：{{ agent.description }}

# 或创建 .github/copilot-instructions.md：
# {{ agent.name }} — {{ agent.description }}</code></pre>
            </div>
          </div>
        </div>

        <!-- Reviews Tab -->
        <div v-if="activeTab === 'reviews'" class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
          <div v-if="agent.ratingCount === 0" class="text-center py-12">
            <p class="text-5xl mb-3">💬</p>
            <h3 class="text-lg font-semibold text-ink-heading mb-2">暂无评价</h3>
            <p class="text-ink-muted">成为第一个评价此 Agent 的用户</p>
          </div>
          <div v-else class="text-center py-12">
            <p class="text-ink-muted">评价列表将在数据库迁移后加载</p>
          </div>
        </div>

        <!-- Related Tab -->
        <div v-if="activeTab === 'related'" class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
          <div v-if="related.length === 0" class="text-center py-12">
            <p class="text-ink-muted">暂无相关 Agent</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="r in related"
              :key="r.slug"
              :to="`/agents/${r.slug}`"
              class="card-gleam bg-surface-base rounded-2xl p-5 border border-ink-muted/10 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet/10 to-brand-sky/10 flex items-center justify-center text-lg">
                  {{ r.emoji || '🤖' }}
                </div>
                <div>
                  <h4 class="font-medium text-ink-heading">{{ r.name }}</h4>
                  <span :class="`dept-tag dept-tag--${r.department} text-xs`">{{ r.departmentLabel }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="mt-8 flex items-center gap-4">
          <button @click="onCopy" class="btn-gradient">
            {{ copied ? '✅ 已复制' : '📋 一键复制 Prompt' }}
          </button>
          <button class="px-5 py-3 rounded-xl border border-ink-muted/20 text-ink-heading font-medium hover:bg-white/60 hover:shadow-card transition-all duration-200">⭐ 收藏</button>
          <button class="px-5 py-3 rounded-xl border border-ink-muted/20 text-ink-heading font-medium hover:bg-white/60 hover:shadow-card transition-all duration-200">🔗 分享</button>
        </div>
      </div>
    </template>
  </div>
</template>
