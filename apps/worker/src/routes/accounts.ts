import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { successResponse, BadRequestError } from '@tsuta/core'
import { users, follows, blocks, mutes } from '../db/schema'
import { eq, and } from 'drizzle-orm'
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
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const followerId = auth.userId!

  if (followerId === targetId) {
    throw new BadRequestError('cannot follow yourself')
  }

  const existing = await db.select().from(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, targetId)))
    .get()

  if (existing) {
    return c.json({ following: true })
  }

  const id = crypto.randomUUID()
  await db.insert(follows).values({ id, followerId, followingId: targetId }).run()
  return c.json({ following: true })
})

accounts.post('/:id/unfollow', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const followerId = auth.userId!

  await db.delete(follows)
    .where(and(eq(follows.followerId, followerId), eq(follows.followingId, targetId)))
    .run()

  return c.json({ following: false })
})

accounts.post('/:id/block', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const blockerId = auth.userId!

  const existing = await db.select().from(blocks)
    .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, targetId)))
    .get()

  if (!existing) {
    const id = crypto.randomUUID()
    await db.insert(blocks).values({ id, blockerId, blockedId: targetId }).run()
  }

  return c.json({ blocking: true })
})

accounts.post('/:id/unblock', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const blockerId = auth.userId!

  await db.delete(blocks)
    .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, targetId)))
    .run()

  return c.json({ blocking: false })
})

accounts.post('/:id/mute', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const muterId = auth.userId!

  const existing = await db.select().from(mutes)
    .where(and(eq(mutes.muterId, muterId), eq(mutes.mutedId, targetId)))
    .get()

  if (!existing) {
    const id = crypto.randomUUID()
    await db.insert(mutes).values({ id, muterId, mutedId: targetId }).run()
  }

  return c.json({ muting: true })
})

accounts.post('/:id/unmute', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const targetId = c.req.param('id')
  const muterId = auth.userId!

  await db.delete(mutes)
    .where(and(eq(mutes.muterId, muterId), eq(mutes.mutedId, targetId)))
    .run()

  return c.json({ muting: false })
})

export { accounts }
