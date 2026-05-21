import db from '~/server/utils/db'
import { agents, reviews } from '~/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { reviewSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const { userId } = event.context.user
  const body = await readBody(event)

  const parsed = reviewSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0].message })
  }

  // Find agent
  const agentResult = await db.select({ id: agents.id }).from(agents).where(eq(agents.slug, slug)).limit(1)
  if (agentResult.length === 0) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  const agentId = agentResult[0].id

  // Check for existing review (one per user per agent)
  const existing = await db.select({ id: reviews.id }).from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.agentId, agentId)))
    .limit(1)

  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: '你已经评价过此 Agent' })
  }

  // Insert review
  await db.insert(reviews).values({
    userId,
    agentId,
    rating: parsed.data.rating,
    title: parsed.data.title,
    comment: parsed.data.comment,
  })

  // Update agent rating aggregate
  const agg = await db.select({
    avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`,
    count: sql<number>`COUNT(*)::int`,
  }).from(reviews).where(eq(reviews.agentId, agentId))

  await db.update(agents).set({
    avgRating: Number(agg[0].avg).toFixed(2),
    ratingCount: agg[0].count,
  }).where(eq(agents.id, agentId))

  return { success: true }
})
