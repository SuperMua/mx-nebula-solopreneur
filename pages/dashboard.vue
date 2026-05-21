<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { user, isLoggedIn } = useAuth()

const { data: usageData } = await useAsyncData('usage', () =>
  $fetch('/api/v1/users/me/usage').catch(() => ({ success: true, data: { executionCount: 0, workflowCount: 0, tier: 'free' } }))
)

const usage = computed(() => (usageData.value as any)?.data || {})
const tierLimits: Record<string, { workflows: number; executions: number }> = {
  free: { workflows: 5, executions: 10 },
  pro: { workflows: Infinity, executions: Infinity },
  enterprise: { workflows: Infinity, executions: Infinity },
}
const limits = computed(() => tierLimits[usage.value.tier || 'free'] || tierLimits.free)
</script>

<template>
  <div class="page-section">
    <h1 class="text-3xl font-bold text-ink-heading mb-1">仪表盘</h1>
    <p class="text-ink-muted mb-8">欢迎回来，{{ user?.username || user?.email }}</p>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="glass-card p-6">
        <p class="text-ink-muted text-sm mb-1">本月执行次数</p>
        <p class="text-3xl font-bold text-gradient">{{ usage.executionCount || 0 }} <span class="text-lg text-ink-muted">/ {{ limits.executions === Infinity ? '∞' : limits.executions }}</span></p>
      </div>
      <div class="glass-card p-6">
        <p class="text-ink-muted text-sm mb-1">工作流数量</p>
        <p class="text-3xl font-bold text-gradient">{{ usage.workflowCount || 0 }} <span class="text-lg text-ink-muted">/ {{ limits.workflows === Infinity ? '∞' : limits.workflows }}</span></p>
      </div>
      <div class="glass-card p-6">
        <p class="text-ink-muted text-sm mb-1">当前套餐</p>
        <p class="text-3xl font-bold text-gradient capitalize">{{ usage.tier || 'Free' }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NuxtLink to="/workflows" class="glass-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block">
        <h3 class="font-semibold text-ink-heading text-lg mb-2">📋 我的工作流</h3>
        <p class="text-sm text-ink-muted">管理你的工作流，拖拽 Agent 编排协作</p>
      </NuxtLink>
      <NuxtLink to="/agents" class="glass-card p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block">
        <h3 class="font-semibold text-ink-heading text-lg mb-2">🔍 浏览 Agent</h3>
        <p class="text-sm text-ink-muted">发现新的 AI 专家角色，扩展你的团队</p>
      </NuxtLink>
    </div>
  </div>
</template>
