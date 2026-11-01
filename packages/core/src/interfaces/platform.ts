import type { Cache } from './cache'
import type { Database } from './database'
import type { Queue } from './queue'
import type { Storage } from './storage'

export type Platform = 'cloudflare' | 'node' | 'bun'

export interface PlatformConfig {
  platform: Platform
  database: Database
  storage: Storage
  cache: Cache
  queue: Queue
}

export interface TsutaContext {
  env: PlatformConfig
  requestId?: string
}
