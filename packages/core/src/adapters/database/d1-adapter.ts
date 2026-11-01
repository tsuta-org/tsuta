import type { Database, DatabaseAdapter } from '../../interfaces/database'

export class D1Database implements Database {
  constructor(private db: D1DatabaseType) {}

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const stmt = this.db.prepare(sql)
    const bound = params.length > 0 ? stmt.bind(...params) : stmt
    const result = await bound.all()
    return (result.results || []) as T[]
  }

  async execute(sql: string, params: unknown[] = []): Promise<{ changes: number; lastInsertRowid?: number }> {
    const stmt = this.db.prepare(sql)
    const bound = params.length > 0 ? stmt.bind(...params) : stmt
    const result = await bound.run()
    return {
      changes: result.changes || 0,
      lastInsertRowid: result.meta?.last_row_id,
    }
  }

  async transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
    // D1 doesn't have traditional transactions in the same way, but we can execute sequentially
    // For now, just execute without transaction wrapper
    return fn(this)
  }
}

export class D1Adapter implements DatabaseAdapter {
  createDatabase(config: { db: D1DatabaseType }): Database {
    return new D1Database(config.db)
  }
}

// Type reference for D1
type D1DatabaseType = any
