import bcrypt from 'bcryptjs'
import db from '~/server/utils/db'
import { users } from '~/server/db/schema'
import { registerSchema } from '~/server/utils/validation'
import { signAccessToken, signRefreshToken } from '~/server/utils/jwt'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = registerSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0].message,
    })
  }

  const { email, username, password } = parsed.data

  // Check existing
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (existing.length > 0) {
    throw createError({ statusCode: 409, message: '该邮箱已被注册' })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const [user] = await db.insert(users).values({
    email,
    username,
    passwordHash,
  }).returning({ id: users.id, email: users.email, username: users.username })

  const accessToken = await signAccessToken({ userId: user.id, email: user.email })
  const refreshToken = await signRefreshToken({ userId: user.id })

  return {
    success: true,
    data: {
      user: { id: user.id, email: user.email, username: user.username },
      accessToken,
      refreshToken,
    },
  }
})
