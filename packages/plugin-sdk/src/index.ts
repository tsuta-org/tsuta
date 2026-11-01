export interface PluginManifest {
  name: string
  version: string
  permissions: string[]
}

export interface TsutaPlugin {
  manifest: PluginManifest
  activate(context: any): Promise<void>
  deactivate(): Promise<void>
}
