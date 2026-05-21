import { verifyToken } from '../utils/jwt'

export default defineEventHandler(async (event) => {
  // Only protect API routes
  if (!event.path.startsWith('/api/')) return

  // Skip auth for public routes
  const publicPaths = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/auth/refresh']
  const path = event.path

  if (publicPaths.some(p => path.startsWith(p))) return
  if (path.startsWith('/api/v1/agents') && event.method === 'GET') return
  if (path.startsWith('/api/v1/departments')) return
  if (path.startsWith('/api/v1/tools')) return
  if (path.startsWith('/api/v1/webhooks')) return
  if (path.startsWith('/api/v1/admin')) return
  if (path.startsWith('/api/v1/community')) return
  // Stream endpoints use query-parameter token (EventSource has no custom headers)
  if (path.includes('/stream')) return

  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  try {
    const payload = await verifyToken(token)
    event.context.user = payload
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired token' })
  }
})
