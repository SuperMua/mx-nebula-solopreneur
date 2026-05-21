import bcrypt from 'bcryptjs'
import db from '~/server/utils/db'
import { users } from '~/server/db/schema'
import { loginSchema } from '~/server/utils/validation'
import { signAccessToken, signRefreshToken } from '~/server/utils/jwt'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    throw createError({ statusCode: 400, message: parsed.error.errors[0].message })
  }

  const { email, password } = parsed.data

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
  if (result.length === 0) {
    throw createError({ statusCode: 401, message: '邮箱或密码不正确' })
  }

  const user = result[0]
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    throw createError({ statusCode: 401, message: '邮箱或密码不正确' })
  }

  // Update last login
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id))

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
