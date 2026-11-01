import { Hono } from 'hono'
import { D1Adapter, PlatformFactory } from '@tsuta/core'
import { authMiddleware, requireAuth } from './middleware/auth'
import type { AuthEnv } from './middleware/auth'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  REALTIME: DurableObjectNamespace
  DELIVERY_QUEUE: Queue
}

const app = new Hono<{ Bindings: Env; Variables: AuthEnv['Variables'] }>()

// Register adapters
PlatformFactory.register('cloudflare', {
  createPlatform: (config: Env) => {
    const dbAdapter = new D1Adapter()
    return {
      platform: 'cloudflare',
      database: dbAdapter.createDatabase({ db: config.DB }),
      storage: {} as any, // TODO: implement R2 adapter
      cache: {} as any,    // TODO: implement KV adapter
      queue: {} as any,    // TODO: implement Queue adapter
    } as any
  }
})

app.use('*', authMiddleware)

app.get('/', (c) => {
  return c.json({ name: 'tsuta', status: 'ok' })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

app.get('/me', requireAuth, (c) => {
  const auth = c.get('auth')
  return c.json({ userId: auth.userId })
})

export default app
