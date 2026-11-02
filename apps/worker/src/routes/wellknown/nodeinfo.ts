import { Hono } from 'hono'

const nodeinfo = new Hono()

nodeinfo.get('/', (c) => {
  return c.json({
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: 'https://tsuta.local/nodeinfo/2.0',
      },
    ],
  })
})

nodeinfo.get('/2.0', (c) => {
  return c.json({
    version: '2.0',
    software: {
      name: 'tsuta',
      version: '0.0.0',
    },
    protocols: ['activitypub'],
    services: {
      inbound: [],
      outbound: [],
    },
    usage: {
      users: { total: 0 },
      localPosts: 0,
    },
    openRegistrations: true,
  })
})

export { nodeinfo }
