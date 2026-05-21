import * as jose from 'jose'

const getSecret = () => {
  const secret = process.env.JWT_SECRET || 'dev-secret-change-in-production'
  return new TextEncoder().encode(secret)
}

export async function signAccessToken(payload: { userId: string; email: string }) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecret())
}

export async function signRefreshToken(payload: { userId: string }) {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jose.jwtVerify(token, getSecret())
  return payload as { userId: string; email?: string }
}
