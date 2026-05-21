import db from '~/server/utils/db'
import { workflowExecutions, workflowNodeExecutions } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { verifyToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  // Auth via query token (EventSource doesn't support custom headers)
  const token = getQuery(event).token as string | undefined
  if (!token) throw createError({ statusCode: 401, message: 'Unauthorized' })

  let userId: string
  try {
    const payload = await verifyToken(token) as { userId: string }
    userId = payload.userId
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired token' })
  }

  const executionId = getRouterParam(event, 'executionId')
  if (!executionId) throw createError({ statusCode: 400 })

  // Set SSE headers
  setHeader(event, 'Content-Type', 'text/event-stream')
  setHeader(event, 'Cache-Control', 'no-cache')
  setHeader(event, 'Connection', 'keep-alive')
  setHeader(event, 'X-Accel-Buffering', 'no')

  let lastStatus = ''
  let closed = false

  event.node.req.on('close', () => {
    closed = true
  })

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
