import { createMiddleware } from 'hono/factory'
import { TsutaError } from '@tsuta/core'

export const errorHandler = createMiddleware(async (c, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof TsutaError) {
      return c.json(
        {
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
        },
        err.statusCode
      )
    }

    console.error('Unhandled error:', err)
    return c.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal Server Error',
        },
      },
      500
    )
  }
})
