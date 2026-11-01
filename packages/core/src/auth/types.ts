export interface AuthToken {
  token: string
  userId: string
  expiresAt: Date
  scopes: string[]
}

export interface Session {
  id: string
  userId: string
  createdAt: Date
  expiresAt: Date
}

export interface AuthContext {
  userId?: string
  token?: string
  isAuthenticated: boolean
}
