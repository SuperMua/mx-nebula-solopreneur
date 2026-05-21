import { verifyToken, signAccessToken } from '~/server/utils/jwt'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { refreshToken } = body || {}

  if (!refreshToken) {
    throw createError({ statusCode: 400, message: 'Refresh token is required' })
  }

  try {
    const payload = await verifyToken(refreshToken)
    const accessToken = await signAccessToken({ userId: payload.userId, email: payload.email || '' })
    return { success: true, data: { accessToken } }
  } catch {
    throw createError({ statusCode: 401, message: 'Invalid or expired refresh token' })
  }
})
