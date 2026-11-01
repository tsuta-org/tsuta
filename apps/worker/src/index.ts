import { Hono } from 'hono'
import type { PlatformConfig } from '@tsuta/core'

export interface Env extends PlatformConfig {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  REALTIME: DurableObjectNamespace
  DELIVERY_QUEUE: Queue
}

const app = new Hono<{ Bindings: Env }>()

app.get('/', (c) => {
  return c.json({ name: 'tsuta', status: 'ok' })
})

app.get('/health', (c) => {
  return c.json({ status: 'healthy' })
})

export default app
