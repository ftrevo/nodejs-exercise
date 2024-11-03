import type { Request, Response, NextFunction } from 'express'
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
} from 'sequelize'
import ValidationError from '../helpers/errors/validation-error'
import NotFoundError from '../helpers/errors/not-found-error'

export const errorHandler = (error: any, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof ValidationError || error instanceof NotFoundError) {
    return response.status(error.statusCode).json({
      errors: error.errors,
    })
  }

  if (error instanceof ForeignKeyConstraintError) {
    return response.status(400).json({
      errors: ['Municipality or Package not found'],
    })
  }

  if (error instanceof UniqueConstraintError) {
    return response.status(400).json({
      errors: [error.message],
    })
  }

  if (error instanceof SequelizeValidationError) {
    return response.status(400).json({
      errors: error.errors.map((errorInstance) => errorInstance.message),
    })
  }

  return response.status(500).json({
    errors: ['Internal Server Error'],
  })
}
