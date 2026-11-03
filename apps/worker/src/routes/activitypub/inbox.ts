import { Hono } from 'hono'
import { verifySignature } from '../../activitypub/signatures'

const inbox = new Hono()

inbox.post('/:username/inbox', async (c) => {
  const username = c.req.param('username')
  const body = await c.req.json()
  
  const signature = c.req.header('Signature')
  if (signature) {
    const verified = await verifySignature(
      await import('../../activitypub/signatures').then(m => m.generateKeyPair()).then(k => k.publicKey),
      {
        method: 'POST',
        path: `/users/${username}/inbox`,
        headers: {
          host: c.req.header('Host') || '',
          date: c.req.header('Date') || '',
          digest: c.req.header('Digest') || '',
        },
        body: JSON.stringify(body),
      },
      signature
    )
    
    if (!verified) {
      return c.json({ error: 'Invalid signature' }, 401)
    }
  }

  return c.json({ ok: true }, 202)
})

export { inbox }
