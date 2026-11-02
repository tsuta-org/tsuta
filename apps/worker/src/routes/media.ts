import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth'

const media = new Hono()

media.post('/', requireAuth, async (c) => {
  const auth = c.get('auth')
  const body = await c.req.parseBody()
  const file = body.file

  if (!file || typeof file === 'string') {
    return c.json({ error: 'file required' }, 400)
  }

  const arrayBuffer = await file.arrayBuffer()
  const id = crypto.randomUUID()
  const key = `media/${id}`

  await c.env.R2.put(key, arrayBuffer, {
    httpMetadata: { contentType: file.type },
  })

  return c.json({
    id,
    type: 'image',
    url: `https://tsuta.local/media/${id}`,
    preview_url: `https://tsuta.local/media/${id}`,
  }, 200)
})

export { media }
