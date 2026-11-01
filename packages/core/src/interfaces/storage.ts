export interface StorageObject {
  key: string
  body: ReadableStream | ArrayBuffer | Uint8Array | string
  contentType?: string
}

export interface Storage {
  put(key: string, value: StorageObject['body'], options?: { contentType?: string }): Promise<void>
  get(key: string): Promise<{ body: ReadableStream | null; contentType?: string } | null>
  delete(key: string): Promise<void>
  list(prefix?: string): Promise<string[]>
}

export interface StorageAdapter {
  createStorage(config: any): Storage
}
