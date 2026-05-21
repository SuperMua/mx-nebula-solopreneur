import db from '~/server/utils/db'
import { workflows } from '~/server/db/schema'
import { workflowSchema } from '~/server/utils/validation'
import { validateDAG } from '~/server/utils/dag'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const body = await readBody(event)

  const parsed = workflowSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0].message })
  }

  const dag = parsed.data.dagJson
  // Only validate if there are nodes (allow empty canvas for new workflows)
  if ((dag.nodes || []).length > 0) {
    const validation = validateDAG(dag.nodes || [], dag.edges || [])
    if (!validation.valid) {
      throw createError({ statusCode: 400, message: validation.message || '工作流配置无效' })
    }
  }

  const [wf] = await db.insert(workflows).values({
    userId,
    name: parsed.data.name,
    description: parsed.data.description,
    dagJson: dag as any,
    isPublic: parsed.data.isPublic ?? false,
  }).returning()

  return { success: true, data: wf }
})
