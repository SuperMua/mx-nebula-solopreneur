import db from '~/server/utils/db'
import { favorites, agents } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const agentSlug = getRouterParam(event, 'agentSlug')
  if (!agentSlug) {
    throw createError({ statusCode: 400, message: 'Agent slug is required' })
  }

  const { userId } = event.context.user

  // Find agent
  const agentResult = await db.select({ id: agents.id })
    .from(agents).where(eq(agents.slug, agentSlug)).limit(1)

  if (agentResult.length === 0) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  await db.delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.agentId, agentResult[0].id)))

  return { success: true }
})
