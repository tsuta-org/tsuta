import { createMiddleware } from 'hono/factory'
import type { AuthContext } from '@tsuta/core'
import { getCookie } from 'hono/cookie'

export type AuthEnv = {
  Variables: {
    auth: AuthContext
  }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const cookieToken = getCookie(c, 'token')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : cookieToken

  const auth: AuthContext = {
    isAuthenticated: false,
    token,
  }

  if (token) {
    auth.isAuthenticated = true
  }

  c.set('auth', auth)
  await next()
})

export const requireAuth = createMiddleware<AuthEnv>(async (c, next) => {
  const auth = c.get('auth')
  if (!auth.isAuthenticated) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  await next()
})
