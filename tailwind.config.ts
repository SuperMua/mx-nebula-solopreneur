import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './composables/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#F8F7FC',
          card: '#FFFFFF',
          glass: 'rgba(255, 255, 255, 0.72)',
          elevated: '#FFFFFF',
        },
        brand: {
          violet: '#7C3AED',
          sky: '#3B82F6',
          coral: '#FF6B6B',
          peach: '#FFA07A',
        },
        ink: {
          heading: '#1E1B4B',
          body: '#475569',
          muted: '#94A3B8',
        },
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(124, 58, 237, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        'glow': '0 0 40px rgba(59, 130, 246, 0.15), 0 0 80px rgba(124, 58, 238, 0.08)',
        'glow-accent': '0 0 40px rgba(255, 107, 107, 0.12), 0 0 80px rgba(255, 160, 122, 0.06)',
        'card': '0 1px 3px rgba(124, 58, 237, 0.06), 0 4px 16px rgba(124, 58, 237, 0.04)',
        'card-hover': '0 2px 8px rgba(124, 58, 237, 0.08), 0 8px 32px rgba(124, 58, 237, 0.06), 0 0 0 1px rgba(124, 58, 237, 0.1)',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      keyframes: {
        gleam: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.05)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(15px) scale(0.95)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.4)' },
          '100%': { boxShadow: '0 0 0 12px rgba(59, 130, 246, 0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        gleam: 'gleam 0.6s ease-in-out',
        float: 'float 18s ease-in-out infinite',
        'float-delayed': 'float-delayed 20s ease-in-out 5s infinite',
        'pulse-glow': 'pulse-glow 2s ease-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.65, 0, 0.35, 1)',
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
}
