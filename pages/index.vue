<template>
  <div class="relative overflow-hidden">
    <!-- Gradient Orbs Background -->
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      <div class="gradient-orb gradient-orb--violet absolute -top-40 -left-20 w-[500px] h-[500px] animate-float opacity-40" />
      <div class="gradient-orb gradient-orb--sky absolute top-20 right-[-10%] w-[400px] h-[400px] animate-float-delayed opacity-35" />
      <div class="gradient-orb gradient-orb--coral absolute -bottom-40 left-[30%] w-[350px] h-[350px] animate-float opacity-30" style="animation-delay: 8s;" />
    </div>

    <!-- Hero Section -->
    <section class="page-section text-center relative">
      <div class="max-w-3xl mx-auto">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-violet/5 text-brand-violet text-sm font-medium mb-8 animate-fade-in-up">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          已接入 215+ AI 专家角色
        </div>

        <h1 class="text-5xl md:text-7xl font-extrabold text-ink-heading leading-tight mb-6 animate-fade-in-up">
          一句话
          <span class="text-gradient">组团队</span>
          <br />
          AI 专家帮你干活
        </h1>

        <p class="text-xl text-ink-body leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-in-up">
          不再是一个人对一个 AI。拖拽 215 个专家角色到画布，连线编排，
          一键执行 —— 几分钟拿到完整营销方案、技术方案、产品方案。
        </p>

        <div class="flex items-center justify-center gap-4 animate-fade-in-up">
          <NuxtLink to="/register" class="btn-gradient text-lg px-8 py-4">
            免费开始使用
          </NuxtLink>
          <NuxtLink to="/agents" class="px-8 py-4 rounded-2xl text-lg font-medium text-ink-heading border border-ink-muted/20 hover:bg-white/60 hover:shadow-card transition-all duration-300">
            浏览 Agent →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16">
      <div class="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div class="glass-card p-8 text-center">
          <p class="text-4xl font-extrabold text-gradient mb-2">215</p>
          <p class="text-sm text-ink-muted">AI 专家角色</p>
        </div>
        <div class="glass-card p-8 text-center">
          <p class="text-4xl font-extrabold text-gradient mb-2">18</p>
          <p class="text-sm text-ink-muted">专业领域</p>
        </div>
        <div class="glass-card p-8 text-center">
          <p class="text-4xl font-extrabold text-gradient mb-2">17</p>
          <p class="text-sm text-ink-muted">AI 工具兼容</p>
        </div>
        <div class="glass-card p-8 text-center">
          <p class="text-4xl font-extrabold text-gradient mb-2">50</p>
          <p class="text-sm text-ink-muted">中国原创角色</p>
        </div>
      </div>
    </section>

    <!-- Workflow Demo Preview -->
    <section class="page-section">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-5xl font-bold text-ink-heading mb-4">
          可视化编排，<span class="text-gradient">像纳豆一样连线</span>
        </h2>
        <p class="text-lg text-ink-muted max-w-2xl mx-auto">
          拖拽 Agent 到画布，用连线定义协作顺序。无依赖的节点自动并行执行，DAG 引擎帮你调度一切。
        </p>
      </div>

      <!-- Mock workflow canvas -->
      <div class="max-w-4xl mx-auto glass-card p-8">
        <div class="flex items-center justify-center gap-12 flex-wrap">
          <!-- Node 1 -->
          <div class="flex flex-col items-center gap-3">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-2xl shadow-lg shadow-rose-200">
              📕
            </div>
            <span class="text-xs font-medium text-ink-body">小红书运营</span>
          </div>

          <!-- Arrow -->
          <div class="flex items-center">
            <div class="w-16 h-0.5 bg-gradient-to-r from-rose-300 to-sky-300 rounded-full relative">
              <div class="absolute -right-1.5 -top-1 w-3 h-3 border-t-2 border-r-2 border-sky-400 rotate-45" />
            </div>
          </div>

          <!-- Node 2 -->
          <div class="flex flex-col items-center gap-3">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400 to-sky-500 flex items-center justify-center text-2xl shadow-lg shadow-sky-200">
              🎵
            </div>
            <span class="text-xs font-medium text-ink-body">抖音策略</span>
          </div>

          <!-- Arrow -->
          <div class="flex items-center">
            <div class="w-16 h-0.5 bg-gradient-to-r from-sky-300 to-violet-300 rounded-full relative">
              <div class="absolute -right-1.5 -top-1 w-3 h-3 border-t-2 border-r-2 border-violet-400 rotate-45" />
            </div>
          </div>

          <!-- Node 3 -->
          <div class="flex flex-col items-center gap-3">
            <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-400 to-violet-500 flex items-center justify-center text-2xl shadow-lg shadow-violet-200 animate-pulse-glow">
              💬
            </div>
            <span class="text-xs font-medium text-ink-body">私域运营</span>
          </div>
        </div>

        <div class="text-center mt-8">
          <p class="text-sm text-ink-muted">
            小红书种草 → 抖音视频脚本 → 微信社群 SOP<br />
            三个节点，两条连线，一键出方案
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="page-section text-center">
      <div class="glass-card max-w-2xl mx-auto p-12">
        <h2 class="text-3xl font-bold text-ink-heading mb-4">
          准备好<span class="text-gradient">组建你的AI团队</span>了吗？
        </h2>
        <p class="text-ink-muted mb-8">
          免费开始，无需下载。浏览器打开即用。
        </p>
        <NuxtLink to="/register" class="btn-gradient text-lg px-10 py-4 inline-block">
          免费注册，立即使用
        </NuxtLink>
        <p class="text-xs text-ink-muted mt-4">
          免费版包含 5 个工作流 · 10 次执行/月
        </p>
      </div>
    </section>
  </div>
</template>
