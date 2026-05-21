import db from '~/server/utils/db'
import { workflows, workflowExecutions, workflowNodeExecutions } from '~/server/db/schema'
import { eq, and } from 'drizzle-orm'
import { validateDAG } from '~/server/utils/dag'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400 })

  // Load workflow
  const [wf] = await db.select().from(workflows)
    .where(and(eq(workflows.id, id), eq(workflows.userId, userId)))
    .limit(1)

  if (!wf) {
    throw createError({ statusCode: 404, message: 'Workflow not found' })
  }

  const dag = wf.dagJson as { nodes: any[]; edges: any[] }
  const validation = validateDAG(dag.nodes || [], dag.edges || [])
  if (!validation.valid) {
    throw createError({ statusCode: 400, message: validation.message })
  }

  // Create execution record
  const [exec] = await db.insert(workflowExecutions).values({
    workflowId: id,
    userId,
    status: 'pending',
    dagSnapshot: dag as any,
    inputData: {},
  }).returning()

  // Create node execution records
  if (dag.nodes?.length > 0) {
    await db.insert(workflowNodeExecutions).values(
      dag.nodes.map((node: any) => ({
        executionId: exec.id,
        nodeId: node.id,
        agentSlug: node.data?.agentSlug || '',
        status: 'pending',
        inputData: {},
        outputData: {},
      }))
    )
  }

  // Update workflow execution count
  await db.update(workflows)
    .set({ executionCount: (wf.executionCount || 0) + 1, lastExecutedAt: new Date() })
    .where(eq(workflows.id, id))

  // Queue the execution (fire-and-forget in dev, BullMQ in prod)
  runExecution(exec.id).catch(err => {
    console.error('Execution failed:', err)
  })

  return {
    success: true,
    data: {
      executionId: exec.id,
      status: 'pending',
    },
  }
})

// Simple in-process execution runner
async function runExecution(executionId: string) {
  // Update status to running
  await db.update(workflowExecutions)
    .set({ status: 'running', startedAt: new Date() })
    .where(eq(workflowExecutions.id, executionId))

  try {
    // Get all node executions
    const nodeExecs = await db.select()
      .from(workflowNodeExecutions)
      .where(eq(workflowNodeExecutions.executionId, executionId))

    // Execute each node sequentially (in production, use topological sort for parallelism)
    for (const nodeExec of nodeExecs) {
      await db.update(workflowNodeExecutions)
        .set({ status: 'running', startedAt: new Date() })
        .where(eq(workflowNodeExecutions.id, nodeExec.id))

      // Simulate execution (in production, call LLM API with the agent prompt)
      await new Promise(resolve => setTimeout(resolve, 500))

      await db.update(workflowNodeExecutions)
        .set({
          status: 'completed',
          outputData: { message: `节点 ${nodeExec.agentSlug} 执行完成（模拟）` },
          completedAt: new Date(),
        })
        .where(eq(workflowNodeExecutions.id, nodeExec.id))
    }

    await db.update(workflowExecutions)
      .set({ status: 'completed', outputData: { result: '工作流执行完成' }, completedAt: new Date() })
      .where(eq(workflowExecutions.id, executionId))
  } catch (err: any) {
    await db.update(workflowExecutions)
      .set({ status: 'failed', errorMessage: err.message, completedAt: new Date() })
      .where(eq(workflowExecutions.id, executionId))
  }
}
