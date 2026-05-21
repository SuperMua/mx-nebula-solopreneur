export default defineNuxtRouteMiddleware(() => {
  if (import.meta.server) return

  const token = localStorage.getItem('accessToken')
  if (!token) {
    return navigateTo('/login')
  }
})
