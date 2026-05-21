// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  // Disable devtools to avoid auth prompt blocking the page in dev
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'MX-星云一人公司 — AI Agent 可视化平台',
      meta: [
        { name: 'description', content: '215+ AI 专家角色，一键组团队。可视化编排、实时执行，让 AI 协作像团队一样高效。' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Noto+Sans+SC:wght@400;500;600;700&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    jwtSecret: process.env.JWT_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    resendApiKey: process.env.RESEND_API_KEY,

    public: {
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      agencyAgentsRepo: 'https://github.com/jnMetaCode/agency-agents-zh',
    }
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  typescript: {
    strict: true,
  },
})
