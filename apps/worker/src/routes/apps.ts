import { Hono } from 'hono'
import { successResponse } from '@tsuta/core'

const apps = new Hono()

apps.post('/', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({
    id: '1',
    name: body.client_name || 'app',
    website: body.website || null,
    redirect_uri: body.redirect_uris || body.redirect_uri,
    client_id: crypto.randomUUID(),
    client_secret: crypto.randomUUID(),
    vapid_key: null,
  }, 200)
})

export { apps }
