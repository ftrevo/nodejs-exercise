import type { Request, Response, NextFunction } from 'express'
import {
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError as SequelizeValidationError,
  type ValidationErrorItem,
} from 'sequelize'
import ValidationError from '../helpers/errors/validation-error'
import NotFoundError from '../helpers/errors/not-found-error'
import { errorHandler } from './error-handler'

describe('Error Handler Middleware', () => {
  let mockResponse: Partial<Response>
  const nextFunction: NextFunction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  it('should handle ValidationError', () => {
    const error = new ValidationError(['Invalid input'])
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Invalid input'],
    })
  })

  it('should handle NotFoundError', () => {
    const error = new NotFoundError('Entity X')
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Entity X not found'],
    })
  })

  it('should handle ForeignKeyConstraintError', () => {
    const error = new ForeignKeyConstraintError({
      message: 'Foreign key constraint error',
    })
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Municipality or Package not found'],
    })
  })

  it('should handle UniqueConstraintError', () => {
    const error = new UniqueConstraintError({
      message: 'Unique constraint error',
    })
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Unique constraint error'],
    })
  })

  it('should handle SequelizeValidationError', () => {
    const error = new SequelizeValidationError('Sequelize validation error', [
      { message: 'Invalid input Y' } as ValidationErrorItem,
    ])
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Invalid input Y'],
    })
  })

  it('should handle other errors', () => {
    const error = new Error('Generic error')
    errorHandler(error, {} as Request, mockResponse as Response, nextFunction)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: ['Internal Server Error'],
    })
  })
})
