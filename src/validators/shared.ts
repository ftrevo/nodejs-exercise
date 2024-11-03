import type { Request } from 'express'
import ValidationError from '../helpers/errors/validation-error'
import { validateId, validateName, validateOptionalNumberOnQueryString } from './validations'

export const validateGetAllRequest = (request: Request) => {
  const { limit, offset } = request.query

  const errors = []

  const limitErrorMessage = validateOptionalNumberOnQueryString(limit, 'Invalid limit')
  if (limitErrorMessage) {
    errors.push(limitErrorMessage)
  }

  const offsetErrorMessage = validateOptionalNumberOnQueryString(offset, 'Invalid offset')
  if (offsetErrorMessage) {
    errors.push(offsetErrorMessage)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return {
    limit: limit ? Number.parseInt(`${limit as string}`, 10) : undefined,
    offset: offset ? Number.parseInt(`${offset as string}`, 10) : undefined,
  }
}

export const validateDetailsRequest = (request: Request) => {
  const { id } = request.params

  const idErrorMessage = validateId(id)

  if (idErrorMessage) {
    throw new ValidationError([idErrorMessage])
  }

  const integerId = Number.parseInt(id, 10)

  return { id: integerId }
}

export const validateCreateRequest = (request: Request) => {
  const { name } = request.body

  const nameErrorMessage = validateName(name)

  if (nameErrorMessage) {
    throw new ValidationError([nameErrorMessage])
  }

  return { name: `${name.trim()}` }
}

export const validateUpdateRequest = (request: Request) => {
  const { id } = request.params
  const { name } = request.body

  const errors = []

  const idErrorMessage = validateId(id)
  if (idErrorMessage) {
    errors.push(idErrorMessage)
  }

  const nameErrorMessage = validateName(name)
  if (nameErrorMessage) {
    errors.push(nameErrorMessage)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return { id: Number.parseInt(id, 10), name: `${name.trim()}` }
}
