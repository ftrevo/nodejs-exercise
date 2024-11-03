import type { Request } from 'express'
import ValidationError from '../helpers/errors/validation-error'
import { validateIdNumber, validateNumber, validateOptionalIdOnQueryString, validateYear } from './validations'

export const validateCreatePriceRequest = (request: Request) => {
  const { priceCents, packageId, municipalityId } = request.body

  const errors = []

  const priceCentsErrorMessage = validateNumber(priceCents, 'Invalid price')
  if (priceCentsErrorMessage) {
    errors.push(priceCentsErrorMessage)
  }

  const packageIdErrorMessage = validateIdNumber(packageId, 'Invalid package id')
  if (packageIdErrorMessage) {
    errors.push(packageIdErrorMessage)
  }

  const municipalityIdErrorMessage = validateIdNumber(municipalityId, 'Invalid municipality id')
  if (municipalityIdErrorMessage) {
    errors.push(municipalityIdErrorMessage)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return {
    priceCents: Number.parseInt(priceCents, 10),
    packageId: Number.parseInt(packageId, 10),
    municipalityId: Number.parseInt(municipalityId, 10),
  }
}

export const validateGetActiveRequest = (request: Request) => {
  const { packageId, municipalityId } = request.query

  const errors = []

  const packageIdErrorMessage = validateOptionalIdOnQueryString(packageId, 'Invalid package id')
  if (packageIdErrorMessage) {
    errors.push(packageIdErrorMessage)
  }

  const municipalityIdErrorMessage = validateOptionalIdOnQueryString(municipalityId, 'Invalid municipality id')

  if (municipalityIdErrorMessage) {
    errors.push(municipalityIdErrorMessage)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return {
    packageId: packageId ? Number.parseInt(packageId as string, 10) : undefined,
    municipalityId: municipalityId ? Number.parseInt(municipalityId as string, 10) : undefined,
  }
}

export const validateGetHistoryRequest = (request: Request) => {
  const { year, packageId, municipalityId } = request.query

  const errors = []

  const yearErrorMessage = validateYear(year)

  if (yearErrorMessage) {
    errors.push(yearErrorMessage)
  }

  const packageIdErrorMessage = validateOptionalIdOnQueryString(packageId, 'Invalid package id')
  if (packageIdErrorMessage) {
    errors.push(packageIdErrorMessage)
  }

  const municipalityIdErrorMessage = validateOptionalIdOnQueryString(municipalityId, 'Invalid municipality id')

  if (municipalityIdErrorMessage) {
    errors.push(municipalityIdErrorMessage)
  }

  if (errors.length > 0) {
    throw new ValidationError(errors)
  }

  return {
    year: year as string,
    packageId: packageId ? Number.parseInt(packageId as string, 10) : undefined,
    municipalityId: municipalityId ? Number.parseInt(municipalityId as string, 10) : undefined,
  }
}
