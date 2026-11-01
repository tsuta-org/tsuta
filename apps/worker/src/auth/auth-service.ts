import type { AuthService, AuthToken, Session, AuthContext } from '@tsuta/core'

export class DefaultAuthService implements AuthService {
  private tokens = new Map<string, AuthToken>()
  private sessions = new Map<string, Session>()

  async createToken(userId: string, scopes: string[] = []): Promise<AuthToken> {
    const token = crypto.randomUUID()
    const authToken: AuthToken = {
      token,
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      scopes,
    }
    this.tokens.set(token, authToken)
    return authToken
  }

  async validateToken(token: string): Promise<AuthContext> {
    const authToken = this.tokens.get(token)
    if (!authToken || authToken.expiresAt < new Date()) {
      return { isAuthenticated: false }
    }
    return {
      userId: authToken.userId,
      token: authToken.token,
      isAuthenticated: true,
    }
  }

  async revokeToken(token: string): Promise<void> {
    this.tokens.delete(token)
  }

  async createSession(userId: string): Promise<Session> {
    const id = crypto.randomUUID()
    const session: Session = {
      id,
      userId,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
    this.sessions.set(id, session)
    return session
  }

  async validateSession(sessionId: string): Promise<AuthContext> {
    const session = this.sessions.get(sessionId)
    if (!session || session.expiresAt < new Date()) {
      return { isAuthenticated: false }
    }
    return {
      userId: session.userId,
      isAuthenticated: true,
    }
  }
}
