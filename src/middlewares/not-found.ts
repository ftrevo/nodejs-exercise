import type { Request } from 'express'
import NotFoundError from '../helpers/errors/not-found-error'

export const notFoundMiddleware = (request: Request) => {
  throw new NotFoundError(`Resource ${request.originalUrl}`)
}
