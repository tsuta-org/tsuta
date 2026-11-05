import { Hono } from 'hono'
import { D1Adapter, PlatformFactory } from '@tsuta/core'
import { authMiddleware, requireAuth } from './middleware/auth'
import { errorHandler } from './middleware/error'
import { accounts } from './routes/accounts'
import { statuses } from './routes/posts'
import { timelines } from './routes/timelines'
import { apps } from './routes/apps'
import { webfinger } from './routes/activitypub/webfinger'
import { actor } from './routes/activitypub/actor'
import { inbox } from './routes/activitypub/inbox'
import { nodeinfo } from './routes/wellknown/nodeinfo'
import { notifications } from './routes/notifications'
import { search } from './routes/search'
import { lists } from './routes/lists'
import { media } from './routes/media'
import type { AuthEnv } from './middleware/auth'

export interface Env {
  DB: D1Database
  KV: KVNamespace
  R2: R2Bucket
  REALTIME: DurableObjectNamespace
  DELIVERY_QUEUE: Queue
}

export class RealtimeDO {
  state: DurableObjectState
  env: Env
  constructor(state: DurableObjectState, env: Env) {
    this.state = state
    this.env = env
  }
  async fetch() {
    return new Response('ok')
  }
}

const app = new Hono<{ Bindings: Env; Variables: AuthEnv['Variables'] }>()

app.use('*', errorHandler)

PlatformFactory.register('cloudflare', {
  createPlatform: (config: Env) => {
    const dbAdapter = new D1Adapter()
    return {
      platform: 'cloudflare',
      database: dbAdapter.createDatabase({ db: config.DB }),
      storage: {} as any,
      cache: {} as any,
      queue: {} as any,
    } as any
  }
})

app.use('*', authMiddleware)

app.route('/api/v1/accounts', accounts)
app.route('/api/v1/statuses', statuses)
app.route('/api/v1/timelines', timelines)
app.route('/api/v1/apps', apps)
app.route('/api/v1/notifications', notifications)
app.route('/api/v2/search', search)
app.route('/api/v1/search', search)
app.route('/api/v1/lists', lists)
app.route('/api/v1/media', media)
app.get('/media/:id', async (c) => {
  const id = c.req.param('id')
  if (c.env.R2) {
    const object = await c.env.R2.get(`media/${id}`)
    if (!object) {
      return c.json({ error: 'not found' }, 404)
    }
    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set('etag', object.httpEtag)
    return new Response(object.body, { headers })
  }
  return c.json({ error: 'not found' }, 404)
})
app.route('/.well-known/webfinger', webfinger)
app.route('/.well-known/nodeinfo', nodeinfo)
app.route('/nodeinfo', nodeinfo)
app.route('/users', actor)
app.route('/users', inbox)

app.get('/', (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tsuta</title>
  <style>body{font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px}a{color:#0066cc}</style>
</head>
<body>
  <h1>Tsuta（蔦）</h1>
  <p>軽量分散SNS</p>
  <ul>
    <li><a href="/login">ログイン</a></li>
    <li><a href="/register">登録</a></li>
    <li><a href="/admin">管理画面</a></li>
  </ul>
</body>
</html>`
  return c.html(html)
})

app.get('/health', (c) => {
  return c.json({ success: true, data: { status: 'healthy' } })
})

app.get('/login', (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>ログイン - Tsuta</title><style>body{font-family:sans-serif;max-width:400px;margin:40px auto;padding:20px}input{width:100%;padding:8px;margin:8px 0}button{padding:10px 20px}</style></head>
<body>
  <h1>ログイン</h1>
  <form id="form">
    <input name="username" placeholder="ユーザー名" required>
    <button type="submit">ログイン</button>
  </form>
  <p><a href="/">戻る</a></p>
  <script>
    document.getElementById('form').onsubmit = async (e) => {
      e.preventDefault()
      const form = new FormData(e.target)
      const res = await fetch('/api/v1/accounts/login', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:form.get('username')})})
      const data = await res.json()
      alert(JSON.stringify(data))
    }
  </script>
</body>
</html>`
  return c.html(html)
})

app.get('/register', (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>登録 - Tsuta</title><style>body{font-family:sans-serif;max-width:400px;margin:40px auto;padding:20px}input{width:100%;padding:8px;margin:8px 0}button{padding:10px 20px}</style></head>
<body>
  <h1>新規登録</h1>
  <form id="form">
    <input name="username" placeholder="ユーザー名" required>
    <input name="displayName" placeholder="表示名">
    <button type="submit">登録</button>
  </form>
  <p><a href="/">戻る</a></p>
  <script>
    document.getElementById('form').onsubmit = async (e) => {
      e.preventDefault()
      const form = new FormData(e.target)
      const res = await fetch('/api/v1/accounts/register', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:form.get('username'), displayName:form.get('displayName')})})
      const data = await res.json()
      alert(JSON.stringify(data))
    }
  </script>
</body>
</html>`
  return c.html(html)
})

app.get('/admin', requireAuth, async (c) => {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>管理画面 - Tsuta</title><style>body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px}</style></head>
<body>
  <h1>管理画面</h1>
  <p>管理者用画面</p>
  <p><a href="/">戻る</a></p>
</body>
</html>`
  return c.html(html)
})

app.get('/api/v1/accounts/verify_credentials', requireAuth, async (c) => {
  const auth = c.get('auth')
  return c.json({ id: auth.userId, username: 'user' })
})

app.get('/api/v1/instance', (c) => {
  return c.json({
    uri: 'tsuta.local',
    title: 'Tsuta',
    description: 'A lightweight federated social network',
    version: '0.0.0',
    urls: {},
    stats: { user_count: 0, status_count: 0, domain_count: 0 },
    thumbnail: null,
    languages: ['en'],
    registrations: true,
    approval_required: false,
    invites_enabled: false,
    configuration: {
      statuses: { max_characters: 500, max_media_attachments: 4 },
      media_attachments: { supported_mime_types: ['image/jpeg', 'image/png', 'image/gif'], image_size_limit: 10485760 },
    },
  })
})

app.get('/api/v2/instance', (c) => {
  return c.json({
    domain: 'tsuta.local',
    title: 'Tsuta',
    version: '0.0.0',
  })
})

export default app
