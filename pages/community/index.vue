<script setup lang="ts">
const { data: communityData, pending } = await useAsyncData('community-agents', () =>
  $fetch('/api/v1/community/agents')
)

const agents = computed(() => (communityData.value as any)?.data || [])
</script>

<template>
  <div class="page-section">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-ink-heading mb-3">社区 Agent</h1>
      <p class="text-lg text-ink-muted">由社区贡献的 AI 专家角色，发现更多可能性</p>
    </div>

    <!-- Coming soon banner -->
    <div class="max-w-3xl mx-auto glass-card p-10 text-center mb-10">
      <p class="text-5xl mb-4">🚧</p>
      <h2 class="text-xl font-bold text-ink-heading mb-2">社区功能即将上线</h2>
      <p class="text-ink-muted mb-6">用户可以提交自己的 Agent 角色，分享给所有人使用。包含提交、审核、评价的完整流程。</p>
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet/5 text-brand-violet text-sm font-medium">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Phase 2 开发中
      </div>
    </div>

    <!-- Pending agents (if any) -->
    <div v-if="!pending && agents.length > 0" class="max-w-4xl mx-auto">
      <h3 class="font-semibold text-ink-heading mb-4">最新社区 Agent</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink
          v-for="agent in agents"
          :key="agent.slug"
          :to="`/agents/${agent.slug}`"
          class="card-gleam bg-white rounded-2xl p-5 border border-ink-muted/10 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 block"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet/10 to-brand-sky/10 flex items-center justify-center text-lg">
              {{ agent.emoji || '🤖' }}
            </div>
            <div>
              <h4 class="font-medium text-ink-heading text-sm">{{ agent.name }}</h4>
              <span :class="`dept-tag dept-tag--${agent.department} text-[10px]`">{{ agent.departmentLabel }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
