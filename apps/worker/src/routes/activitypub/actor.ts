import { Hono } from 'hono'

const actor = new Hono()

actor.get('/:username', (c) => {
  const username = c.req.param('username')
  return c.json({
    '@context': ['https://www.w3.org/ns/activitystreams'],
    id: `https://tsuta.local/users/${username}`,
    type: 'Person',
    preferredUsername: username,
    inbox: `https://tsuta.local/users/${username}/inbox`,
    outbox: `https://tsuta.local/users/${username}/outbox`,
    followers: `https://tsuta.local/users/${username}/followers`,
    following: `https://tsuta.local/users/${username}/following`,
    publicKey: {
      id: `https://tsuta.local/users/${username}#main-key`,
      owner: `https://tsuta.local/users/${username}`,
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----',
    },
  }, 200, {
    'Content-Type': 'application/activity+json',
  })
})

actor.post('/:username/inbox', async (c) => {
  return c.json({ ok: true }, 202)
})

actor.get('/:username/outbox', (c) => {
  return c.json({
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: `https://tsuta.local/users/${c.req.param('username')}/outbox`,
    type: 'OrderedCollection',
    totalItems: 0,
    orderedItems: [],
  }, 200, {
    'Content-Type': 'application/activity+json',
  })
})

export { actor }
