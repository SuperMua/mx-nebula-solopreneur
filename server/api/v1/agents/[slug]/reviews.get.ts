import db from '~/server/utils/db'
import { agents, reviews, users } from '~/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  sort: z.enum(['newest', 'highest', 'lowest']).default('newest'),
})

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  const query = await getValidatedQuery(event, querySchema.parse)

  // Find agent
  const agentResult = await db.select({ id: agents.id, slug: agents.slug })
    .from(agents).where(eq(agents.slug, slug)).limit(1)

  if (agentResult.length === 0) {
    throw createError({ statusCode: 404, message: 'Agent not found' })
  }

  const agentId = agentResult[0].id

  const orderBy = {
    newest: desc(reviews.createdAt),
    highest: desc(reviews.rating),
    lowest: reviews.rating,
  }[query.sort]

  const rows = await db.select({
    id: reviews.id,
    rating: reviews.rating,
    title: reviews.title,
    comment: reviews.comment,
    createdAt: reviews.createdAt,
    user: {
      username: users.username,
      displayName: users.displayName,
      avatarUrl: users.avatarUrl,
    },
  })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(eq(reviews.agentId, agentId))
    .orderBy(orderBy)
    .limit(query.limit)
    .offset((query.page - 1) * query.limit)

  return {
    success: true,
    data: rows,
    meta: {
      page: query.page,
      limit: query.limit,
    },
  }
})
