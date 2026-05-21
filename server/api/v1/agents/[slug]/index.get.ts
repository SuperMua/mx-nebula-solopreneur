import db from '~/server/utils/db'
import { agents } from '~/server/db/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const result = await db.select().from(agents).where(eq(agents.slug, slug)).limit(1)

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  const agent = result[0]

  // Increment view count
  await db.update(agents)
    .set({ viewCount: sql`${agents.viewCount} + 1` })
    .where(eq(agents.id, agent.id))

  // Get related agents (same department, excluding self)
  const related = await db.select({
    id: agents.id,
    slug: agents.slug,
    name: agents.name,
    emoji: agents.emoji,
    color: agents.color,
    department: agents.department,
    departmentLabel: agents.departmentLabel,
    avgRating: agents.avgRating,
  })
    .from(agents)
    .where(eq(agents.department, agent.department))
    .limit(6)

  return {
    success: true,
    data: {
      ...agent,
      related: related.filter(r => r.id !== agent.id).slice(0, 5),
    },
  }
})
