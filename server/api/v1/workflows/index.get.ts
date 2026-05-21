import db from '~/server/utils/db'
import { workflows } from '~/server/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
})

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const query = await getValidatedQuery(event, querySchema.parse)

  const [totalResult, rows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(workflows).where(eq(workflows.userId, userId)),
    db.select({
      id: workflows.id,
      name: workflows.name,
      description: workflows.description,
      isPublic: workflows.isPublic,
      executionCount: workflows.executionCount,
      lastExecutedAt: workflows.lastExecutedAt,
      updatedAt: workflows.updatedAt,
      createdAt: workflows.createdAt,
    })
      .from(workflows)
      .where(eq(workflows.userId, userId))
      .orderBy(desc(workflows.updatedAt))
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
  ])

  return {
    success: true,
    data: rows,
    meta: {
      total: totalResult[0]?.count ?? 0,
      page: query.page,
      limit: query.limit,
    },
  }
})
