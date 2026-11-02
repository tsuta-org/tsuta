import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { successResponse, BadRequestError } from '@tsuta/core'
import { posts, likes, reblogs } from '../db/schema'
import { drizzle } from 'drizzle-orm/d1'
import { desc, eq, and } from 'drizzle-orm'

const statuses = new Hono()

statuses.get('/', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(20).all()
  return c.json(result)
})

statuses.post('/', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const body = await c.req.json().catch(() => ({}))
  const { status } = body

  if (!status || status.trim() === '') {
    throw new BadRequestError('status required')
  }

  const id = crypto.randomUUID()
  await db.insert(posts).values({ id, authorId: auth.userId!, content: status }).run()

  const post = await db.select().from(posts).where(eq(posts.id, id)).get()
  return c.json(post, 201)
})

statuses.get('/:id', async (c) => {
  const db = drizzle(c.env.DB)
  const id = c.req.param('id')
  const post = await db.select().from(posts).where(eq(posts.id, id)).get()
  if (!post) {
    return c.json({ error: 'not found' }, 404)
  }
  return c.json(post)
})

statuses.post('/:id/favourite', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const postId = c.req.param('id')
  const userId = auth.userId!

  const existing = await db.select().from(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
    .get()

  if (!existing) {
    const id = crypto.randomUUID()
    await db.insert(likes).values({ id, userId, postId }).run()
  }

  return c.json({ favourited: true })
})

statuses.post('/:id/unfavourite', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const postId = c.req.param('id')
  const userId = auth.userId!

  await db.delete(likes)
    .where(and(eq(likes.userId, userId), eq(likes.postId, postId)))
    .run()

  return c.json({ favourited: false })
})

statuses.post('/:id/reblog', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const postId = c.req.param('id')
  const userId = auth.userId!

  const existing = await db.select().from(reblogs)
    .where(and(eq(reblogs.userId, userId), eq(reblogs.postId, postId)))
    .get()

  if (!existing) {
    const id = crypto.randomUUID()
    await db.insert(reblogs).values({ id, userId, postId }).run()
  }

  return c.json({ reblogged: true })
})

statuses.post('/:id/unreblog', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const auth = c.get('auth')
  const postId = c.req.param('id')
  const userId = auth.userId!

  await db.delete(reblogs)
    .where(and(eq(reblogs.userId, userId), eq(reblogs.postId, postId)))
    .run()

  return c.json({ reblogged: false })
})

export { statuses }
