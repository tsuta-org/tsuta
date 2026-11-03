import { subtle, getRandomValues } from 'crypto'

export interface HTTPMessage {
  method: string
  path: string
  headers: Record<string, string>
  body: string
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return await subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  )
}

export async function exportPublicKey(key: CryptoKey): Promise<string> {
  const spki = await subtle.exportKey('spki', key)
  const base64 = btoa(String.fromCharCode(...new Uint8Array(spki)))
  return `-----BEGIN PUBLIC KEY-----\n${base64.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`
}

export async function signRequest(privateKey: CryptoKey, message: HTTPMessage): Promise<string> {
  const signingString = [
    `(request-target): ${message.method.toLowerCase()} ${message.path}`,
    `host: ${message.headers.host || ''}`,
    `date: ${message.headers.date || ''}`,
    `digest: ${message.headers.digest || ''}`,
  ].filter(Boolean).join('\n')

  const encoder = new TextEncoder()
  const data = encoder.encode(signingString)
  const signature = await subtle.sign('RSASSA-PKCS1-v1_5', privateKey, data)
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
}

export async function verifySignature(publicKey: CryptoKey, message: HTTPMessage, signature: string): Promise<boolean> {
  const signingString = [
    `(request-target): ${message.method.toLowerCase()} ${message.path}`,
    `host: ${message.headers.host || ''}`,
    `date: ${message.headers.date || ''}`,
    `digest: ${message.headers.digest || ''}`,
  ].filter(Boolean).join('\n')

  const encoder = new TextEncoder()
  const data = encoder.encode(signingString)
  const sigBytes = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
  
  try {
    return await subtle.verify('RSASSA-PKCS1-v1_5', publicKey, sigBytes, data)
  } catch {
    return false
  }
}
