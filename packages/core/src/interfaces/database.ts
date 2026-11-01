export interface Database {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>
  execute(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid?: number }>
  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>
}

export interface DatabaseAdapter {
  createDatabase(config: any): Database
}
