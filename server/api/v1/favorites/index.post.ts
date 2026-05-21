import db from '~/server/utils/db'
import { favorites, agents } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const body = await readBody(event)
  const { agentSlug } = body

  if (!agentSlug) {
    throw createError({ statusCode: 400, message: 'agentSlug is required' })
  }

  const [agent] = await db.select({ id: agents.id })
    .from(agents).where(eq(agents.slug, agentSlug)).limit(1)

  if (!agent) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  // Check if already favorited
  const [existing] = await db.select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.agentId, agent.id)))
    .limit(1)

  if (existing) {
    return { success: true, data: { alreadyFavorited: true } }
  }

  await db.insert(favorites).values({
    userId,
    agentId: agent.id,
  })

  return { success: true, data: { favorited: true } }
})
