import { Hono } from 'hono'
import { D1Adapter, PlatformFactory } from '@tsuta/core'
import type { PlatformConfig } from '@tsuta/core'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  REALTIME: DurableObjectNamespace
  DELIVERY_QUEUE: Queue
}

const app = new Hono<{ Bindings: Env }>()

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
    } as PlatformConfig
  }
})

app.get('/', (c) => {
  return c.json({ name: 'tsuta', status: 'ok' })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

export default app
