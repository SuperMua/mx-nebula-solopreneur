<template>
  <div class="page-section">
    <!-- Agent Hero -->
    <div class="max-w-4xl mx-auto mb-12">
      <div class="flex items-start gap-6">
        <div class="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-violet/15 to-brand-sky/15 flex items-center justify-center text-4xl shadow-lg shrink-0">
          📕
        </div>
        <div>
          <div class="flex items-center gap-3 mb-2">
            <span class="dept-tag dept-tag--marketing">营销部</span>
            <span class="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600">⭐ 中国原创</span>
          </div>
          <h1 class="text-3xl font-bold text-ink-heading mb-2">小红书运营专家</h1>
          <p class="text-lg text-ink-muted">专注小红书平台的内容运营专家，擅长种草笔记创作、达人合作策略、爆款内容公式。</p>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="max-w-4xl mx-auto">
      <div class="flex gap-1 mb-8 border-b border-ink-muted/10">
        <button class="px-5 py-3 text-sm font-medium text-brand-violet border-b-2 border-brand-violet">概览</button>
        <button class="px-5 py-3 text-sm font-medium text-ink-muted hover:text-ink-body transition-colors">安装指南</button>
        <button class="px-5 py-3 text-sm font-medium text-ink-muted hover:text-ink-body transition-colors">评价 (42)</button>
        <button class="px-5 py-3 text-sm font-medium text-ink-muted hover:text-ink-body transition-colors">相关 Agent</button>
      </div>

      <!-- Content -->
      <div class="bg-white rounded-3xl p-8 shadow-card border border-ink-muted/10">
        <div class="prose prose-lg max-w-none">
          <h2>核心使命</h2>
          <h3>内容策略制定</h3>
          <ul>
            <li>基于品牌定位和目标人群，制定小红书内容矩阵</li>
            <li>规划内容日历：种草笔记、测评、教程、合集、避坑指南</li>
            <li>设计爆款内容公式：标题党法则 + 封面吸引力 + 正文结构</li>
            <li>紧跟平台热点和趋势话题，及时产出蹭热内容</li>
          </ul>

          <h3>达人合作与投放</h3>
          <ul>
            <li>筛选 KOL/KOC：匹配度 > 粉丝量，看互动率而非曝光量</li>
            <li>设计达人合作 brief：既给创作空间又确保品牌信息传达</li>
            <li>管理投放节奏：预热期 → 集中种草期 → 长尾维护期</li>
          </ul>

          <h2>关键规则</h2>
          <h3>平台合规</h3>
          <ul>
            <li>绝不使用违禁词和敏感词（小红书有严格的限流词库）</li>
            <li>达人合作必须走蒲公英平台报备</li>
            <li>不刷量、不买赞，被检测到会导致账号降权</li>
          </ul>

          <h3>内容真实性</h3>
          <ul>
            <li>种草内容必须基于真实体验，不夸大不虚构</li>
            <li>图片不过度修饰，保持"真实感"是小红书的核心调性</li>
          </ul>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mt-8 flex items-center gap-4">
        <button class="btn-gradient">📋 一键复制 Prompt</button>
        <button class="px-5 py-3 rounded-xl border border-ink-muted/20 text-ink-heading font-medium hover:bg-white/60 hover:shadow-card transition-all duration-200">⭐ 收藏</button>
        <button class="px-5 py-3 rounded-xl border border-ink-muted/20 text-ink-heading font-medium hover:bg-white/60 hover:shadow-card transition-all duration-200">🔗 分享</button>
      </div>
    </div>
  </div>
</template>
