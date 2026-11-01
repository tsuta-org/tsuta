import type { Platform, PlatformConfig } from '../interfaces/platform'

export interface AdapterFactory {
  createPlatform(config: any): PlatformConfig
}

export class PlatformFactory {
  private static adapters = new Map<string, AdapterFactory>()

  static register(platform: string, factory: AdapterFactory): void {
    this.adapters.set(platform, factory)
  }

  static create(platform: string, config: any): PlatformConfig {
    const factory = this.adapters.get(platform)
    if (!factory) {
      throw new Error(`No adapter registered for platform: ${platform}`)
    }
    return factory.createPlatform(config)
  }
}
