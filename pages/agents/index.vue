<script setup lang="ts">
const searchQuery = ref('')
const debouncedSearch = ref('')
const selectedDept = ref('all')
const selectedTool = ref('all')
const selectedSource = ref('all')
const selectedSort = ref('newest')
const page = ref(1)
const limit = 20

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchQuery, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedSearch.value = val
    page.value = 1
  }, 300)
})

const { data: deptData } = await useAsyncData('departments', () =>
  $fetch('/api/v1/departments')
)

const { data: toolsData } = await useAsyncData('tools', () =>
  $fetch('/api/v1/tools')
)

const { data: agentData, pending, error, refresh } = await useAsyncData(
  'agents',
  () =>
    $fetch('/api/v1/agents', {
      query: {
        search: debouncedSearch.value || undefined,
        department: selectedDept.value !== 'all' ? selectedDept.value : undefined,
        tool: selectedTool.value !== 'all' ? selectedTool.value : undefined,
        source: selectedSource.value !== 'all' ? selectedSource.value : undefined,
        sort: selectedSort.value,
        page: page.value,
        limit,
      },
    }).catch(() => ({ success: true, data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } })),
  { watch: [debouncedSearch, selectedDept, selectedTool, selectedSource, selectedSort, page] }
)

const departments = computed(() => {
  const list = (deptData.value as any)?.data || []
  return [{ value: 'all', label: '全部部门' }, ...list.map((d: any) => ({
    value: d.department,
    label: `${d.emoji} ${d.label}`,
  }))]
})

const tools = computed(() => {
  const list = (toolsData.value as any)?.data || []
  return [{ value: 'all', label: '全部工具' }, ...list.map((t: any) => ({
    value: t.id,
    label: `${t.icon} ${t.name}`,
  }))]
})

const agents = computed(() => (agentData.value as any)?.data || [])
const meta = computed(() => (agentData.value as any)?.meta || { total: 0, page: 1, totalPages: 1 })

const sourceOptions = [
  { value: 'all', label: '全部来源' },
  { value: 'original', label: '⭐ 中国原创' },
  { value: 'translated', label: '🌐 海外翻译' },
]

const sortOptions = [
  { value: 'newest', label: '最新' },
  { value: 'popular', label: '最热' },
  { value: 'rating', label: '评分' },
  { value: 'name', label: '名称' },
]

function goPage(p: number) {
  if (p >= 1 && p <= meta.value.totalPages) {
    page.value = p
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const visiblePages = computed(() => {
  const total = meta.value.totalPages
  const current = page.value
  const pages: (number | string)[] = []
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})
</script>

<template>
  <div class="page-section">
    <!-- Header -->
    <div class="text-center mb-10">
      <h1 class="text-4xl font-bold text-ink-heading mb-3">Agent 浏览器</h1>
      <p class="text-lg text-ink-muted">浏览 {{ meta.total }} 个 AI 专家角色，找到适合你的那一位</p>
    </div>

    <!-- Search + Filter Bar -->
    <div class="max-w-5xl mx-auto mb-8">
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索 Agent 名称、描述..."
            class="w-full pl-11 pr-4 py-3 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted text-base">🔍</span>
        </div>
        <select
          v-model="selectedDept"
          class="px-4 py-3 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="d in departments" :key="d.value" :value="d.value">{{ d.label }}</option>
        </select>
        <select
          v-model="selectedTool"
          class="px-4 py-3 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="t in tools" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
        <select
          v-model="selectedSource"
          class="px-4 py-3 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="s in sourceOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
        <select
          v-model="selectedSort"
          class="px-4 py-3 rounded-2xl border border-ink-muted/20 bg-white/60 text-ink-heading text-sm focus:outline-none focus:ring-2 focus:ring-brand-violet/20 transition-all duration-200"
        >
          <option v-for="s in sortOptions" :key="s.value" :value="s.value">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <div v-for="i in 8" :key="i" class="bg-white rounded-3xl p-6 border border-ink-muted/10 animate-pulse">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-2xl bg-ink-muted/10" />
          <div class="w-16 h-6 rounded-full bg-ink-muted/10" />
        </div>
        <div class="h-5 bg-ink-muted/10 rounded w-2/3 mb-2" />
        <div class="h-4 bg-ink-muted/10 rounded w-full mb-1" />
        <div class="h-4 bg-ink-muted/10 rounded w-3/4 mb-4" />
        <div class="flex gap-2">
          <div class="h-6 w-20 rounded-full bg-ink-muted/10" />
          <div class="h-6 w-16 rounded-full bg-ink-muted/10" />
        </div>
      </div>
    </div>

    <!-- Agent Cards Grid -->
    <div v-else-if="agents.length > 0" class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <NuxtLink
        v-for="agent in agents"
        :key="agent.slug"
        :to="`/agents/${agent.slug}`"
        class="card-gleam bg-white rounded-3xl p-6 border border-ink-muted/10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
      >
        <div class="flex items-start justify-between mb-4">
          <div
            class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            :style="{ background: `linear-gradient(135deg, ${agent.color || '#7C3AED'}15, ${agent.color || '#3B82F6'}10)` }"
          >
            {{ agent.emoji || '🤖' }}
          </div>
          <span :class="`dept-tag dept-tag--${agent.department}`">{{ agent.departmentLabel }}</span>
        </div>
        <h3 class="font-semibold text-ink-heading mb-1.5 truncate">{{ agent.name }}</h3>
        <p class="text-sm text-ink-muted line-clamp-2 mb-4">{{ agent.description }}</p>
        <div class="flex items-center gap-2 flex-wrap">
          <span
            v-for="tool in (agent.supportedTools || []).slice(0, 3)"
            :key="tool"
            class="text-xs px-2.5 py-1 rounded-full bg-brand-violet/5 text-brand-violet"
          >{{ tool }}</span>
          <span v-if="agent.source === 'original'" class="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">⭐ 原创</span>
        </div>
        <div v-if="agent.avgRating" class="flex items-center gap-1 mt-3 text-xs text-ink-muted">
          <span class="text-amber-400">★</span> {{ agent.avgRating }}
          <span class="ml-2">👁 {{ agent.viewCount }}</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending" class="text-center py-20">
      <p class="text-6xl mb-4">🔍</p>
      <h3 class="text-xl font-semibold text-ink-heading mb-2">没有找到匹配的 Agent</h3>
      <p class="text-ink-muted">试试调整搜索条件或筛选器</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="text-center py-12">
      <p class="text-ink-muted mb-4">加载失败: {{ error.message }}</p>
      <button @click="refresh()" class="btn-gradient text-sm">重试</button>
    </div>

    <!-- Pagination -->
    <div v-if="meta.totalPages > 1" class="mt-12 flex justify-center">
      <nav class="flex items-center gap-2">
        <button
          :disabled="page <= 1"
          @click="goPage(page - 1)"
          class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-muted hover:bg-white/60 transition-colors disabled:opacity-30"
        >←</button>
        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="text-ink-muted px-1">...</span>
          <button
            v-else
            @click="goPage(p as number)"
            :class="[
              'w-10 h-10 rounded-xl border font-medium transition-colors',
              page === p
                ? 'bg-brand-violet text-white border-brand-violet'
                : 'border-ink-muted/20 text-ink-body hover:bg-white/60'
            ]"
          >{{ p }}</button>
        </template>
        <button
          :disabled="page >= meta.totalPages"
          @click="goPage(page + 1)"
          class="w-10 h-10 rounded-xl border border-ink-muted/20 flex items-center justify-center text-ink-muted hover:bg-white/60 transition-colors disabled:opacity-30"
        >→</button>
      </nav>
    </div>
  </div>
</template>
