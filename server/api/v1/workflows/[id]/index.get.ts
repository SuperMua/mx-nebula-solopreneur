import db from '~/server/utils/db'
import { workflows } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const result = await db.select().from(workflows)
    .where(and(eq(workflows.id, id), eq(workflows.userId, userId)))
    .limit(1)

  if (result.length === 0) {
    throw createError({ statusCode: 404, message: 'Workflow not found' })
  }

  return { success: true, data: result[0] }
})
