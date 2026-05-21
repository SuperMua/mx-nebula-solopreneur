import db from '~/server/utils/db'
import { agents } from '~/server/db/schema'
import { sql, ilike, or, eq, and, desc, asc } from 'drizzle-orm'
import { z } from 'zod'

const querySchema = z.object({
  search: z.string().optional(),
  department: z.string().optional(),
  tool: z.string().optional(),
  source: z.enum(['translated', 'original']).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(250).default(20),
  sort: z.enum(['newest', 'popular', 'rating', 'name']).default('newest'),
})

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, querySchema.parse)

  const conditions = [eq(agents.status, 'active')]

  if (query.search) {
    const pattern = `%${query.search}%`
    // Use raw SQL to handle nullable name_en column
    conditions.push(sql`(
      ${agents.name} ILIKE ${pattern}
      OR ${agents.description} ILIKE ${pattern}
      OR COALESCE(${agents.nameEn}, '') ILIKE ${pattern}
    )`)
  }

  if (query.department) {
    conditions.push(eq(agents.department, query.department))
  }

  if (query.tool) {
    // Check if supported_tools JSONB array contains the tool
    conditions.push(
      sql`${agents.supportedTools}::jsonb ? ${query.tool}`
    )
  }

  if (query.source) {
    conditions.push(eq(agents.source, query.source))
  }

  const orderBy = {
    newest: desc(agents.createdAt),
    popular: desc(agents.viewCount),
    rating: desc(agents.avgRating),
    name: agents.name,
  }[query.sort]

  const where = and(...conditions)

  const [totalResult, rows] = await Promise.all([
    db.select({ count: sql<number>`count(*)::int` }).from(agents).where(where),
    db.select({
      id: agents.id,
      slug: agents.slug,
      name: agents.name,
      nameEn: agents.nameEn,
      description: agents.description,
      emoji: agents.emoji,
      color: agents.color,
      department: agents.department,
      departmentLabel: agents.departmentLabel,
      source: agents.source,
      tags: agents.tags,
      platforms: agents.platforms,
      supportedTools: agents.supportedTools,
      avgRating: agents.avgRating,
      ratingCount: agents.ratingCount,
      downloadCount: agents.downloadCount,
      viewCount: agents.viewCount,
      createdAt: agents.createdAt,
    })
      .from(agents)
      .where(where)
      .orderBy(orderBy)
      .limit(query.limit)
      .offset((query.page - 1) * query.limit),
  ])

  const total = totalResult[0]?.count ?? 0

  return {
    success: true,
    data: rows,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  }
})
