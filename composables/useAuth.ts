export const useAuth = () => {
  const user = ref<any>(null)
  const isLoggedIn = computed(() => !!user.value)
  const loading = ref(true)

  async function fetchUser() {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      loading.value = false
      return
    }
    try {
      const res = await $fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      user.value = (res as any).data
    } catch {
      // Token invalid/expired, try refresh
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        try {
          const refreshRes = await $fetch('/api/v1/auth/refresh', {
            method: 'POST',
            body: { refreshToken },
          })
          const newToken = (refreshRes as any).data.accessToken
          localStorage.setItem('accessToken', newToken)
          const res = await $fetch('/api/v1/auth/me', {
            headers: { Authorization: `Bearer ${newToken}` },
          })
          user.value = (res as any).data
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
    } finally {
      loading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.value = null
    navigateTo('/')
  }

  // Fetch on mount (client only)
  if (import.meta.client) {
    fetchUser()
  }

  return { user, isLoggedIn, loading, logout, fetchUser }
}
