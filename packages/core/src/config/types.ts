export interface AppConfig {
  env: 'development' | 'production' | 'test'
  baseUrl: string
  port?: number
}
