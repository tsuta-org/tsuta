import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'
import { successResponse } from '@tsuta/core'

const accounts = new Hono()

accounts.post('/register', async (c) => {
  // TODO: implement registration
  return c.json(successResponse({ message: 'not implemented' }))
})

accounts.post('/login', async (c) => {
  // TODO: implement login
  return c.json(successResponse({ message: 'not implemented' }))
})

accounts.get('/me', requireAuth, async (c) => {
  const auth = c.get('auth')
  return c.json(successResponse({ userId: auth.userId }))
})

accounts.post('/:id/follow', requireAuth, async (c) => {
  // TODO: implement follow
  return c.json(successResponse({ message: 'not implemented' }))
})

accounts.post('/:id/unfollow', requireAuth, async (c) => {
  // TODO: implement unfollow
  return c.json(successResponse({ message: 'not implemented' }))
})

export { accounts }
