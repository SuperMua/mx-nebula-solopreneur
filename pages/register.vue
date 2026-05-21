<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: undefined })

const username = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

async function handleRegister() {
  errorMsg.value = ''
  if (!username.value || !email.value || !password.value) {
    errorMsg.value = '请填写所有字段'
    return
  }
  if (username.value.length < 3) {
    errorMsg.value = '用户名至少 3 个字符'
    return
  }
  if (password.value.length < 8) {
    errorMsg.value = '密码至少 8 个字符'
    return
  }
  loading.value = true
  try {
    const res = await $fetch('/api/v1/auth/register', {
      method: 'POST',
      body: {
        username: username.value,
        email: email.value,
        password: password.value,
      },
    })
    const data = (res as any).data
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    await navigateTo('/agents')
  } catch (err: any) {
    errorMsg.value = err.data?.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
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
      <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
        <div v-if="errorMsg" class="px-4 py-3 rounded-xl bg-red-50 text-red-600 text-sm">
          {{ errorMsg }}
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">用户名</label>
          <input
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="yourname"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">邮箱</label>
          <input
            v-model="email"
            type="email"
            autocomplete="email"
            placeholder="hello@example.com"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-ink-heading mb-1.5">密码</label>
          <input
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="最少 8 位字符"
            class="w-full px-4 py-3 rounded-xl border border-ink-muted/20 bg-white/60 text-ink-heading placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand-violet/20 focus:border-brand-violet/40 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="btn-gradient w-full py-3 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {{ loading ? '注册中...' : '免费注册' }}
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
