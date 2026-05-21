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

    <!-- Empty State -->
    <div class="text-center py-20">
      <div class="w-24 h-24 rounded-full bg-brand-violet/5 flex items-center justify-center text-5xl mx-auto mb-6">
        🎬
      </div>
      <h3 class="text-xl font-semibold text-ink-heading mb-2">还没有工作流</h3>
      <p class="text-ink-muted mb-6">创建你的第一个工作流，让 AI 专家们协作起来</p>
      <NuxtLink to="/workflows/new" class="btn-gradient text-sm px-6 py-3">
        + 新建工作流
      </NuxtLink>
    </div>
  </div>
</template>
