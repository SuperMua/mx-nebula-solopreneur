import db from '~/server/utils/db'
import { favorites, agents } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user

  const result = await db.select({
    id: favorites.id,
    createdAt: favorites.createdAt,
    agent: {
      id: agents.id,
      slug: agents.slug,
      name: agents.name,
      emoji: agents.emoji,
      color: agents.color,
      department: agents.department,
      departmentLabel: agents.departmentLabel,
      avgRating: agents.avgRating,
      description: agents.description,
    },
  })
    .from(favorites)
    .innerJoin(agents, eq(favorites.agentId, agents.id))
    .where(eq(favorites.userId, userId))
    .orderBy(favorites.createdAt)

  return {
    success: true,
    data: result,
  }
})
