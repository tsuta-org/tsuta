import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { successResponse } from '@tsuta/core'

const posts = new Hono()

posts.get('/', async (c) => {
  return c.json(successResponse([]))
})

posts.post('/', requireAuth, async (c) => {
  // TODO: implement create post
  return c.json(successResponse({ message: 'not implemented' }), 201)
})

posts.get('/:id', async (c) => {
  return c.json(successResponse({ message: 'not implemented' }))
})

posts.post('/:id/like', requireAuth, async (c) => {
  return c.json(successResponse({ message: 'not implemented' }))
})

posts.delete('/:id/like', requireAuth, async (c) => {
  return c.json(successResponse({ message: 'not implemented' }))
})

export { posts }
