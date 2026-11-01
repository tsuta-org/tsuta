import type { AuthToken, Session, AuthContext } from './types'

export interface AuthService {
  createToken(userId: string, scopes?: string[]): Promise<AuthToken>
  validateToken(token: string): Promise<AuthContext>
  revokeToken(token: string): Promise<void>
  createSession(userId: string): Promise<Session>
  validateSession(sessionId: string): Promise<AuthContext>
}
