import db from '~/server/utils/db'
import { favorites, agents } from '~/server/db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user

  const rows = await db.select({
    id: agents.id,
    slug: agents.slug,
    name: agents.name,
    emoji: agents.emoji,
    color: agents.color,
    department: agents.department,
    departmentLabel: agents.departmentLabel,
    description: agents.description,
    avgRating: agents.avgRating,
    favoritedAt: favorites.createdAt,
  })
    .from(favorites)
    .innerJoin(agents, eq(favorites.agentId, agents.id))
    .where(eq(favorites.userId, userId))
    .orderBy(favorites.createdAt)

  return { success: true, data: rows }
})
