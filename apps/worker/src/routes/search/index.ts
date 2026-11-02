import { Hono } from 'hono'

const search = new Hono()

search.get('/', async (c) => {
  const q = c.req.query('q')
  return c.json({
    accounts: [],
    statuses: [],
    hashtags: [],
  })
})

export { search }
