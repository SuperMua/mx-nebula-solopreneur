import db from '~/server/utils/db'
import { favorites, agents } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const favoriteSchema = z.object({
  agentSlug: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const body = await readBody(event)

  const parsed = favoriteSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: 'Invalid agent slug' })
  }

  // Find agent
  const agentResult = await db.select({ id: agents.id })
    .from(agents).where(eq(agents.slug, parsed.data.agentSlug)).limit(1)

  if (agentResult.length === 0) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  const agentId = agentResult[0].id

  // Check if already favorited
  const existing = await db.select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.agentId, agentId)))
    .limit(1)

  if (existing.length > 0) {
    return { success: true, data: { alreadyFavorited: true } }
  }

  await db.insert(favorites).values({ userId, agentId })

  return { success: true, data: { alreadyFavorited: false } }
})
