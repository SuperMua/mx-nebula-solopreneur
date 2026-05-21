<template>
  <div class="page-section">
    <div class="text-center mb-16">
      <h1 class="text-4xl font-bold text-ink-heading mb-3">简单透明的定价</h1>
      <p class="text-lg text-ink-muted">从免费开始，随需求升级</p>
    </div>

    <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Free -->
      <div class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
        <h3 class="text-xl font-bold text-ink-heading mb-2">Free</h3>
        <p class="text-ink-muted mb-6">体验基础功能</p>
        <div class="mb-6">
          <span class="text-5xl font-extrabold text-ink-heading">¥0</span>
          <span class="text-ink-muted ml-1">/月</span>
        </div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 浏览全部 215 个 Agent</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 5 个工作流</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 10 次执行/月</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 社区访问</li>
        </ul>
        <button class="w-full py-3 rounded-xl border-2 border-brand-violet text-brand-violet font-semibold hover:bg-brand-violet/5 transition-colors">
          免费开始
        </button>
      </div>

      <!-- Pro (Highlighted) -->
      <div class="bg-white rounded-3xl p-8 shadow-glow border-2 border-brand-violet relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-violet text-white text-xs font-semibold rounded-full">推荐</div>
        <h3 class="text-xl font-bold text-ink-heading mb-2">Pro</h3>
        <p class="text-ink-muted mb-6">专业用户首选</p>
        <div class="mb-6">
          <span class="text-5xl font-extrabold text-ink-heading">¥69</span>
          <span class="text-ink-muted ml-1">/月</span>
        </div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 全部 Free 功能</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> <strong>无限</strong> 工作流</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> <strong>无限</strong> 执行次数</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 高级工作流编辑器</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 优先支持</li>
        </ul>
        <button class="btn-gradient w-full py-3">
          升级到 Pro
        </button>
      </div>

      <!-- Enterprise -->
      <div class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
        <h3 class="text-xl font-bold text-ink-heading mb-2">Enterprise</h3>
        <p class="text-ink-muted mb-6">团队与组织</p>
        <div class="mb-6">
          <span class="text-5xl font-extrabold text-ink-heading">¥349</span>
          <span class="text-ink-muted ml-1">/月</span>
        </div>
        <ul class="space-y-3 mb-8">
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 全部 Pro 功能</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 团队协作</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> 私有 Agent 库</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> SSO / SAML</li>
          <li class="flex items-center gap-2 text-sm text-ink-body"><span class="text-emerald-500">✓</span> API 访问</li>
        </ul>
        <button class="w-full py-3 rounded-xl border-2 border-ink-muted/20 text-ink-heading font-semibold hover:bg-white/60 transition-colors">
          联系我们
        </button>
      </div>
    </div>
  </div>
</template>
