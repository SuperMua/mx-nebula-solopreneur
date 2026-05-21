<script setup lang="ts">
// Agent browser page - placeholder
const searchQuery = ref('')
const selectedDept = ref('all')
const selectedTool = ref('all')

const departments = [
  { value: 'all', label: '全部部门' },
  { value: 'engineering', label: '🛠️ 工程部' },
  { value: 'marketing', label: '📢 营销部' },
  { value: 'design', label: '🎨 设计部' },
  { value: 'product', label: '📦 产品部' },
  { value: 'finance', label: '🏦 金融部' },
  { value: 'hr', label: '👔 人力资源' },
  { value: 'legal', label: '⚖️ 法务部' },
  { value: 'sales', label: '💼 销售部' },
  { value: 'game', label: '🎮 游戏开发' },
  { value: 'specialized', label: '🔬 专项部' },
]

const tools = [
  { value: 'all', label: '全部工具' },
  { value: 'claude-code', label: 'Claude Code' },
  { value: 'cursor', label: 'Cursor' },
  { value: 'copilot', label: 'GitHub Copilot' },
  { value: 'openclaw', label: 'OpenClaw' },
  { value: 'gemini-cli', label: 'Gemini CLI' },
]
</script>

<template>
  <div class="page-section">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-ink-heading mb-3">Agent 浏览器</h1>
      <p class="text-lg text-ink-muted">浏览 215 个 AI 专家角色，找到适合你的那一位</p>
    </div>

    <!-- Search + Filter Bar -->
    <div class="max-w-4xl mx-auto mb-10">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索 Agent 名称、描述、标签..."
            class="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-lg">🔍</span>
        </div>
        <select
          v-model="selectedDept"
          class="px-4 py-3.5 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="d in departments" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
        <select
          v-model="selectedTool"
          class="px-4 py-3.5 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="t in tools" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
    </div>

    <!-- Agent Cards Grid -->
    <div class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div
        v-for="i in 8"
        :key="i"
        class="card-gleam bg-white rounded-3xl p-6 border border-ink-muted/10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-violet/10 to-brand-sky/10 flex items-center justify-center text-2xl">
            🤖
          </div>
          <span class="dept-tag dept-tag--engineering">工程部</span>
        </div>
        <h3 class="font-semibold text-ink-heading mb-1.5">Agent 名称</h3>
        <p class="text-sm text-ink-muted line-clamp-2 mb-4">这里会显示 Agent 的简短描述，概括其核心能力和专长领域。</p>
        <div class="flex items-center gap-2">
          <span class="text-xs px-2.5 py-1 rounded-full bg-brand-violet/5 text-brand-violet">Claude Code</span>
          <span class="text-xs px-2.5 py-1 rounded-full bg-brand-coral/5 text-brand-coral">Cursor</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="false" class="text-center py-20">
      <p class="text-6xl mb-4">🔍</p>
      <h3 class="text-xl font-semibold text-ink-heading mb-2">没有找到匹配的 Agent</h3>
      <p class="text-ink-muted">试试调整搜索条件或筛选器</p>
    </div>

    <!-- Pagination -->
    <div class="mt-12 flex justify-center">
      <nav class="flex items-center gap-2">
        <button class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-muted hover:bg-white/60 transition-colors">←</button>
        <button class="w-10 h-10 rounded-xl bg-brand-violet text-white font-medium">1</button>
        <button class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-body hover:bg-white/60 transition-colors">2</button>
        <button class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-body hover:bg-white/60 transition-colors">3</button>
        <span class="text-ink-muted px-1">...</span>
        <button class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-body hover:bg-white/60 transition-colors">18</button>
        <button class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-body hover:bg-white/60 transition-colors">→</button>
      </nav>
    </div>
  </div>
</template>
