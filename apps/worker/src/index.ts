import { Hono } from 'hono'
import { D1Adapter, PlatformFactory } from '@tsuta/core'
import { authMiddleware, requireAuth } from './middleware/auth'
import { errorHandler } from './middleware/error'
import { accounts } from './routes/accounts'
import { statuses } from './routes/posts'
import { timelines } from './routes/timelines'
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

export default app
