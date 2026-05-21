import db from '~/server/utils/db'
import { workflowExecutions, workflowNodeExecutions } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const executionId = getRouterParam(event, 'executionId')
  if (!executionId) throw createError({ statusCode: 400 })

  const [exec] = await db.select().from(workflowExecutions)
    .where(and(eq(workflowExecutions.id, executionId), eq(workflowExecutions.userId, userId)))
    .limit(1)

  if (!exec) {
    throw createError({ statusCode: 404, message: 'Execution not found' })
  }

  const nodes = await db.select().from(workflowNodeExecutions)
    .where(eq(workflowNodeExecutions.executionId, executionId))
    .orderBy(workflowNodeExecutions.createdAt)

  return {
    success: true,
    data: {
      ...exec,
      nodes,
    },
  }
})
