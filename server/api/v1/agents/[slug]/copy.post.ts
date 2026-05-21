import db from '~/server/utils/db'
import { agents } from '~/server/db/schema'
import { eq, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug is required' })
  }

  await db.update(agents)
    .set({ downloadCount: sql`${agents.downloadCount} + 1` })
    .where(eq(agents.slug, slug))

  return { success: true }
})
