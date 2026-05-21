import db from '~/server/utils/db'
import { usageRecords, workflows, users } from '~/server/db/schema'
import { eq, and, sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const { userId } = event.context.user

  // Get user tier
  const userResult = await db.select({ tier: users.tier }).from(users).where(eq(users.id, userId)).limit(1)
  const tier = userResult[0]?.tier || 'free'

  // Get current month's usage
  const today = new Date()
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0]

  const [usageResult, wfCount] = await Promise.all([
    db.select({ executionCount: sql<number>`COALESCE(SUM(${usageRecords.executionCount}), 0)` })
      .from(usageRecords)
      .where(and(
        eq(usageRecords.userId, userId),
        sql`${usageRecords.date} >= ${monthStart}`
      )),
    db.select({ count: sql<number>`count(*)::int` })
      .from(workflows)
      .where(eq(workflows.userId, userId)),
  ])

  return {
    success: true,
    data: {
      tier,
      executionCount: usageResult[0]?.executionCount || 0,
      workflowCount: wfCount[0]?.count || 0,
    },
  }
})
