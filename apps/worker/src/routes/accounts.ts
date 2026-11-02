import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { successResponse, BadRequestError } from '@tsuta/core'
import { users } from '../db/schema'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'

const accounts = new Hono()

accounts.post('/register', async (c) => {
  const db = drizzle(c.env.DB)
  const body = await c.req.json().catch(() => ({}))
  const { username, displayName } = body

  if (!username) {
    throw new BadRequestError('username required')
  }

  const existing = await db.select().from(users).where(eq(users.username, username)).get()
  if (existing) {
    throw new BadRequestError('username already taken')
  }

  const id = crypto.randomUUID()
  await db.insert(users).values({ id, username, displayName: displayName || username }).run()

  return c.json(successResponse({ id, username, displayName: displayName || username }), 201)
})

accounts.post('/login', async (c) => {
  const db = drizzle(c.env.DB)
  const body = await c.req.json().catch(() => ({}))
  const { username } = body

  if (!username) {
    throw new BadRequestError('username required')
  }

  const user = await db.select().from(users).where(eq(users.username, username)).get()
  if (!user) {
    throw new BadRequestError('user not found')
  }

  const token = crypto.randomUUID()
  return c.json(successResponse({ token, user }))
})

accounts.get('/me', requireAuth, async (c) => {
  const auth = c.get('auth')
  return c.json(successResponse({ userId: auth.userId }))
})

accounts.post('/:id/follow', requireAuth, async (c) => {
  return c.json(successResponse({ message: 'followed' }))
})

accounts.post('/:id/unfollow', requireAuth, async (c) => {
  return c.json(successResponse({ message: 'unfollowed' }))
})

export { accounts }

accounts.get('/app', async (c) => {
  return c.json({ error: 'not implemented' }, 404)
})
