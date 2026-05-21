import db from '~/server/utils/db'
import { workflows } from '~/server/db/schema'
import { workflowSchema } from '~/server/utils/validation'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const body = await readBody(event)

  const parsed = workflowSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0].message })
  }

  const [wf] = await db.insert(workflows).values({
    userId,
    name: parsed.data.name,
    description: parsed.data.description,
    dagJson: parsed.data.dagJson as any,
    isPublic: parsed.data.isPublic ?? false,
  }).returning()

  return { success: true, data: wf }
})
