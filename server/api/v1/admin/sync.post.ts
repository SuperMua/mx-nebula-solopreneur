import { syncAgents } from '~/server/services/agentSync'

export default defineEventHandler(async (_event) => {
  // In production, verify admin role from event.context.user
  try {
    const result = await syncAgents('manual')
    return { success: true, data: result }
  } catch (err: any) {
    throw createError({ statusCode: 500, message: err.message || 'Sync failed' })
  }
})
