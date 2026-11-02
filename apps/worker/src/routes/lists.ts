import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

const lists = new Hono()

lists.get('/', requireAuth, async (c) => {
  return c.json([])
})

lists.post('/', requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({
    id: crypto.randomUUID(),
    title: body.title || 'New List',
  }, 201)
})

lists.get('/:id', requireAuth, async (c) => {
  return c.json({
    id: c.req.param('id'),
    title: 'List',
  })
})

lists.put('/:id', requireAuth, async (c) => {
  return c.json({
    id: c.req.param('id'),
    title: 'Updated List',
  })
})

lists.delete('/:id', requireAuth, async (c) => {
  return c.json({})
})

lists.post('/:id/accounts', requireAuth, async (c) => {
  return c.json({})
})

lists.delete('/:id/accounts', requireAuth, async (c) => {
  return c.json({})
})

export { lists }
