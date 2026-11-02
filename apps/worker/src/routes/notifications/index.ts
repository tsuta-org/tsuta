import { Hono } from 'hono'
import { requireAuth } from '../../middleware/auth'

const notifications = new Hono()

notifications.get('/', requireAuth, async (c) => {
  return c.json([])
})

notifications.get('/clear', requireAuth, async (c) => {
  return c.json({})
})

export { notifications }
