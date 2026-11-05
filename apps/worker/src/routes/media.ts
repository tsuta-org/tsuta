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
  const contentType = file.type || 'application/octet-stream'

  // Check if R2 is available
  if (c.env.R2) {
    const key = `media/${id}`
    await c.env.R2.put(key, arrayBuffer, {
      httpMetadata: { contentType },
    })

    const url = new URL(c.req.url)
    return c.json({
      id,
      type: 'image',
      url: `${url.origin}/media/${id}`,
      preview_url: `${url.origin}/media/${id}`,
    }, 200)
  }

  // Fallback: convert to base64 data URL
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
  const dataUrl = `data:${contentType};base64,${base64}`

  return c.json({
    id,
    type: 'image',
    url: dataUrl,
    preview_url: dataUrl,
  }, 200)
})

export { media }
