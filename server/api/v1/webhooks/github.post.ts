import { syncAgents } from '~/server/services/agentSync'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const signature = getHeader(event, 'x-hub-signature-256')

  // Verify webhook secret if configured
  const secret = process.env.GITHUB_WEBHOOK_SECRET
  if (secret) {
    if (!signature) {
      throw createError({ statusCode: 401, message: 'Missing signature' })
    }
    const { createHmac } = await import('node:crypto')
    const rawBody = JSON.stringify(body)
    const computed = 'sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex')
    if (signature !== computed) {
      throw createError({ statusCode: 401, message: 'Invalid signature' })
    }
  }

  // Only sync on pushes to main branch
  const ref = body?.ref
  if (ref && ref !== 'refs/heads/main') {
    return { success: true, message: 'Skipped: not main branch' }
  }

  // Run async so we respond quickly
  syncAgents('webhook').catch(err => {
    console.error('Webhook sync failed:', err)
  })

  return { success: true, message: 'Sync triggered' }
})
