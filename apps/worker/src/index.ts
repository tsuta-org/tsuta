import { Hono } from 'hono'
import { D1Adapter, PlatformFactory } from '@tsuta/core'
import { authMiddleware, requireAuth } from './middleware/auth'
import { errorHandler } from './middleware/error'
import { accounts } from './routes/accounts'
import { statuses } from './routes/posts'
import { timelines } from './routes/timelines'
import { apps } from './routes/apps'
import { webfinger } from './routes/activitypub/webfinger'
import { actor } from './routes/activitypub/actor'
import { nodeinfo } from './routes/wellknown/nodeinfo'
import type { AuthEnv } from './middleware/auth'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  REALTIME: DurableObjectNamespace
  DELIVERY_QUEUE: Queue
}

const app = new Hono<{ Bindings: Env; Variables: AuthEnv['Variables'] }>()

app.use('*', errorHandler)

// Register adapters
PlatformFactory.register('cloudflare', {
  createPlatform: (config: Env) => {
    const dbAdapter = new D1Adapter()
    return {
      platform: 'cloudflare',
      database: dbAdapter.createDatabase({ db: config.DB }),
      storage: {} as any,
      cache: {} as any,
      queue: {} as any,
    } as any
  }
})

app.use('*', authMiddleware)

app.route('/api/v1/accounts', accounts)
app.route('/api/v1/statuses', statuses)
app.route('/api/v1/timelines', timelines)
app.route('/api/v1/apps', apps)
app.route('/.well-known/webfinger', webfinger)
app.route('/.well-known/nodeinfo', nodeinfo)
app.route('/nodeinfo', nodeinfo)
app.route('/users', actor)

app.get('/', (c) => {
  return c.json({ success: true, data: { name: 'tsuta', status: 'ok' } })
})

app.get('/health', (c) => {
  return c.json({ success: true, data: { status: 'healthy' } })
})

app.get('/api/v1/accounts/verify_credentials', requireAuth, async (c) => {
  const auth = c.get('auth')
  return c.json({ id: auth.userId, username: 'user' })
})

app.get('/api/v1/instance', (c) => {
  return c.json({
    uri: 'tsuta.local',
    title: 'Tsuta',
    description: 'A lightweight federated social network',
    version: '0.0.0',
    urls: {},
    stats: { user_count: 0, status_count: 0, domain_count: 0 },
    thumbnail: null,
    languages: ['en'],
    registrations: true,
    approval_required: false,
    invites_enabled: false,
    configuration: {
      statuses: { max_characters: 500, max_media_attachments: 4 },
      media_attachments: { supported_mime_types: ['image/jpeg', 'image/png', 'image/gif'], image_size_limit: 10485760 },
    },
  })
})

app.get('/api/v2/instance', (c) => {
  return c.json({
    domain: 'tsuta.local',
    title: 'Tsuta',
    version: '0.0.0',
  })
})

export default app
