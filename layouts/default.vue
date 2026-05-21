<template>
  <div class="flex flex-col min-h-screen">
    <header class="sticky top-0 z-50 border-b border-ink-muted/10 bg-surface-base/80 backdrop-blur-xl">
      <nav class="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <NuxtLink to="/" class="flex items-center gap-2.5 font-bold text-lg text-ink-heading no-underline">
            <span class="text-2xl">🌌</span>
            <span class="text-gradient">MX-星云</span>
          </NuxtLink>
          <div class="hidden md:flex items-center gap-1">
            <NuxtLink to="/agents" class="px-3 py-2 rounded-xl text-sm text-ink-body hover:text-ink-heading hover:bg-white/60 transition-all duration-200">
              Agent 浏览器
            </NuxtLink>
            <NuxtLink to="/workflows" class="px-3 py-2 rounded-xl text-sm text-ink-body hover:text-ink-heading hover:bg-white/60 transition-all duration-200">
              工作流
            </NuxtLink>
            <NuxtLink to="/community" class="px-3 py-2 rounded-xl text-sm text-ink-body hover:text-ink-heading hover:bg-white/60 transition-all duration-200">
              社区
            </NuxtLink>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/pricing" class="hidden md:block px-3 py-2 rounded-xl text-sm text-ink-body hover:text-ink-heading hover:bg-white/60 transition-all duration-200">
            定价
          </NuxtLink>
          <NuxtLink to="/login" class="px-4 py-2 rounded-xl text-sm font-medium text-ink-heading hover:bg-white/60 transition-all duration-200">
            登录
          </NuxtLink>
          <NuxtLink to="/register" class="btn-gradient text-sm px-4 py-2 rounded-xl">
            免费注册
          </NuxtLink>
        </div>
      </nav>
    </header>
    <main class="flex-1">
      <slot />
    </main>
    <footer class="border-t border-ink-muted/10 bg-white/40 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 class="font-semibold text-ink-heading mb-3">产品</h4>
            <div class="flex flex-col gap-2 text-sm text-ink-muted">
              <NuxtLink to="/agents" class="hover:text-ink-body transition-colors">Agent 浏览器</NuxtLink>
              <NuxtLink to="/workflows" class="hover:text-ink-body transition-colors">工作流编辑器</NuxtLink>
              <NuxtLink to="/pricing" class="hover:text-ink-body transition-colors">定价</NuxtLink>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-ink-heading mb-3">资源</h4>
            <div class="flex flex-col gap-2 text-sm text-ink-muted">
              <a href="https://github.com/jnMetaCode/agency-agents-zh" target="_blank" class="hover:text-ink-body transition-colors">Agent 角色库</a>
              <a href="https://github.com/jnMetaCode/agency-orchestrator" target="_blank" class="hover:text-ink-body transition-colors">Orchestrator</a>
              <NuxtLink to="/community" class="hover:text-ink-body transition-colors">社区</NuxtLink>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-ink-heading mb-3">关于</h4>
            <div class="flex flex-col gap-2 text-sm text-ink-muted">
              <a href="https://github.com/SuperMua/mx-nebula-solopreneur" target="_blank" class="hover:text-ink-body transition-colors">GitHub</a>
              <a href="#" class="hover:text-ink-body transition-colors">更新日志</a>
              <a href="#" class="hover:text-ink-body transition-colors">联系我们</a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold text-ink-heading mb-3">MX-星云</h4>
            <p class="text-sm text-ink-muted leading-relaxed">
              215+ AI 专家角色，<br />拖拽编排，实时执行。<br />让 AI 像团队一样协作。
            </p>
          </div>
        </div>
        <div class="mt-10 pt-6 border-t border-ink-muted/10 text-center text-sm text-ink-muted">
          &copy; {{ new Date().getFullYear() }} MX-星云一人公司. Built with Nuxt &amp; Tailwind.
        </div>
      </div>
    </footer>
  </div>
</template>
