import db from '~/server/utils/db'
import { workflowExecutions, workflowNodeExecutions } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const executionId = getRouterParam(event, 'executionId')
  if (!executionId) throw createError({ statusCode: 400 })

  // Set SSE headers
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')

  let lastStatus = ''
  let closed = false

  // Handle client disconnect
  event.node.req.on('close', () => {
    closed = true
  })

  // Poll for status changes every second
  while (!closed) {
    const [exec] = await db.select({
      status: workflowExecutions.status,
    })
      .from(workflowExecutions)
      .where(and(eq(workflowExecutions.id, executionId), eq(workflowExecutions.userId, userId)))
      .limit(1)

    if (!exec) break

    const nodes = await db.select({
      id: workflowNodeExecutions.id,
      nodeId: workflowNodeExecutions.nodeId,
      agentSlug: workflowNodeExecutions.agentSlug,
      status: workflowNodeExecutions.status,
      outputData: workflowNodeExecutions.outputData,
      errorMessage: workflowNodeExecutions.errorMessage,
    })
      .from(workflowNodeExecutions)
      .where(eq(workflowNodeExecutions.executionId, executionId))

    const currentStatus = JSON.stringify({ status: exec.status, nodes })

    if (currentStatus !== lastStatus) {
      lastStatus = currentStatus
      event.node.res.write(`data: ${currentStatus}\n\n`)
    }

    if (exec.status === 'completed' || exec.status === 'failed' || exec.status === 'cancelled') {
      event.node.res.write(`data: [DONE]\n\n`)
      break
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  event.node.res.end()
})
