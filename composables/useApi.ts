// Auth-aware fetch wrapper. Injects the access token from localStorage on the client.
export function useApi() {
  function authHeaders(): Record<string, string> {
    if (import.meta.client) {
      const token = localStorage.getItem('accessToken')
      if (token) return { Authorization: `Bearer ${token}` }
    }
    return {}
  }

  async function api<T = any>(url: string, options: any = {}): Promise<T> {
    return $fetch(url, {
      ...options,
      headers: { ...authHeaders(), ...(options.headers || {}) },
    }) as Promise<T>
  }

  return { api, authHeaders }
}
