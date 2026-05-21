<script setup lang="ts">
definePageMeta({ layout: 'auth' })
</script>

<template>
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-2xl font-bold text-ink-heading no-underline mb-6">
        <span>🌌</span>
        <span class="text-gradient">MX-星云</span>
      </NuxtLink>
      <h1 class="text-2xl font-bold text-ink-heading">创建账号</h1>
      <p class="text-ink-muted mt-2">免费开始，组建你的AI专家团队</p>
    </div>

    <div class="glass-card p-8">
      <form class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">用户名</label>
          <input
            type="text"
            placeholder="yourname"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">邮箱</label>
          <input
            type="email"
            placeholder="hello@example.com"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">密码</label>
          <input
            type="password"
            placeholder="最少 8 位字符"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <button type="submit" class="btn-gradient w-full py-3 mt-2">
          免费注册
        </button>
      </form>

      <div class="mt-6 pt-6 border-t border-ink-muted/10">
        <button class="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading font-medium hover:shadow-card transition-all duration-200">
          <span class="text-lg">🐙</span>
          使用 GitHub 注册
        </button>
      </div>
    </div>

    <p class="text-center text-sm text-ink-muted mt-6">
      已有账号？
      <NuxtLink to="/login" class="text-brand-violet hover:underline font-medium">登录</NuxtLink>
    </p>
  </div>
</template>
