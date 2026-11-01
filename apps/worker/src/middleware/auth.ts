import { createMiddleware } from 'hono/factory'
import type { AuthContext } from '@tsuta/core'

export type AuthEnv = {
  Variables: {
    auth: AuthContext
  }
}

export const authMiddleware = createMiddleware<AuthEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined

  // TODO: implement token validation
  const auth: AuthContext = {
    isAuthenticated: false,
    token,
  }

  if (token) {
    // Placeholder - will be implemented with actual validation
    auth.isAuthenticated = false
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
