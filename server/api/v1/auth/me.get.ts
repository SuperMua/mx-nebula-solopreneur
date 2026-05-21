import db from '~/server/utils/db'
import { users } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { verifyToken } = await import('~/server/utils/jwt')
  let payload
  try {
    payload = await verifyToken(authHeader.slice(7))
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  const result = await db.select({
    id: users.id,
    email: users.email,
    username: users.username,
    displayName: users.displayName,
    avatarUrl: users.avatarUrl,
    bio: users.bio,
    tier: users.tier,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, payload.userId)).limit(1)

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return { success: true, data: result[0] }
})
