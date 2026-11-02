import { Hono } from 'hono'

const webfinger = new Hono()

webfinger.get('/', (c) => {
  const resource = c.req.query('resource')
  if (!resource) {
    return c.json({ error: 'resource required' }, 400)
  }
  return c.json({
    subject: resource,
    links: [
      {
        rel: 'self',
        type: 'application/activity+json',
        href: `https://tsuta.local/users/${resource.split(':').pop()}`,
      },
    ],
  })
})

export { webfinger }
