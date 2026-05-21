import db from '~/server/utils/db'
import { workflows } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { workflowSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  const body = await readBody(event)
  const parsed = workflowSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0].message })
  }

  const [updated] = await db.update(workflows).set({
    name: parsed.data.name,
    description: parsed.data.description,
    dagJson: parsed.data.dagJson as any,
    isPublic: parsed.data.isPublic ?? false,
    updatedAt: new Date(),
  })
    .where(and(eq(workflows.id, id), eq(workflows.userId, userId)))
    .returning()

  if (!updated) {
    throw createError({ statusCode: 404, message: 'Workflow not found' })
  }

  return { success: true, data: updated }
})
