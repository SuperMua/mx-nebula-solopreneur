import db from '~/server/utils/db'
import { agents } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
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
    createdAt: agents.createdAt,
  })
    .from(agents)
    .where(eq(agents.isCommunity, true))
    .orderBy(desc(agents.createdAt))
    .limit(20)

  return { success: true, data: rows }
})
