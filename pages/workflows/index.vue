<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { data: wfData, pending, error, refresh } = await useAsyncData('workflows-list', () =>
  $fetch('/api/v1/workflows')
)

const workflows = computed(() => (wfData.value as any)?.data || [])
const meta = computed(() => (wfData.value as any)?.meta || { total: 0 })

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="page-section">
    <div class="flex items-center justify-between mb-10">
      <div>
        <h1 class="text-3xl font-bold text-ink-heading mb-2">我的工作流</h1>
        <p class="text-ink-muted">拖拽 Agent，连线编排，一键执行</p>
      </div>
      <NuxtLink to="/workflows/new" class="btn-gradient text-sm px-5 py-2.5">
        + 新建工作流
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="bg-white rounded-3xl p-6 border border-ink-muted/10 animate-pulse">
        <div class="h-5 w-48 bg-ink-muted/10 rounded mb-2" />
        <div class="h-4 w-96 bg-ink-muted/10 rounded" />
      </div>
    </div>

    <!-- Workflow List -->
    <div v-else-if="workflows.length > 0" class="space-y-4">
      <NuxtLink
        v-for="wf in workflows"
        :key="wf.id"
        :to="`/workflows/${wf.id}`"
        class="card-gleam bg-white rounded-3xl p-6 border border-ink-muted/10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
      >
        <div class="flex items-center justify-between mb-2">
          <h3 class="font-semibold text-ink-heading">{{ wf.name }}</h3>
          <span class="text-xs text-ink-muted">{{ formatDate(wf.updatedAt) }}</span>
        </div>
        <p class="text-sm text-ink-muted mb-3">{{ wf.description || '暂无描述' }}</p>
        <div class="flex items-center gap-3 text-xs text-ink-muted">
          <span>🔢 {{ wf.dagJson?.nodes?.length || 0 }} 个节点</span>
          <span v-if="wf.executionCount > 0">▶️ 执行 {{ wf.executionCount }} 次</span>
          <span v-if="wf.isPublic" class="text-emerald-500">🌐 公开模板</span>
        </div>
      </NuxtLink>
    </div>

    <!-- Empty State -->
    <div v-else-if="!pending" class="text-center py-20">
      <div class="w-24 h-24 rounded-full bg-brand-violet/5 flex items-center justify-center text-5xl mx-auto mb-6">🎬</div>
      <h3 class="text-xl font-semibold text-ink-heading mb-2">还没有工作流</h3>
      <p class="text-ink-muted mb-6">创建你的第一个工作流，让 AI 专家们协作起来</p>
      <NuxtLink to="/workflows/new" class="btn-gradient text-sm px-6 py-3">+ 新建工作流</NuxtLink>
    </div>

    <!-- Error -->
    <div v-if="error" class="text-center py-12">
      <p class="text-ink-muted mb-4">加载失败</p>
      <button @click="refresh()" class="btn-gradient text-sm">重试</button>
    </div>
  </div>
</template>
