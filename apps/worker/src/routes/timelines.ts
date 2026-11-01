import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { drizzle } from 'drizzle-orm/d1'
import { posts } from '../db/schema'
import { desc } from 'drizzle-orm'

const timelines = new Hono()

timelines.get('/public', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(40).all()
  return c.json(result)
})

timelines.get('/home', requireAuth, async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(40).all()
  return c.json(result)
})

timelines.get('/local', async (c) => {
  const db = drizzle(c.env.DB)
  const result = await db.select().from(posts).orderBy(desc(posts.createdAt)).limit(40).all()
  return c.json(result)
})

export { timelines }
