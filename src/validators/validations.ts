import type { Request } from 'express'
import { idRegex, nameRegex, numberRegex, yearRegex } from '../helpers/constants'
import { isString } from '../helpers/utils'

export const validateName = (candidate: string) => {
  if (!nameRegex.test(candidate.trim())) {
    return 'Invalid name'
  }
}

export const validateIdNumber = (candidate: string, errorMessage: string) => {
  if (!idRegex.test(candidate)) {
    return errorMessage
  }
}

export const validateId = (candidate: string) => validateIdNumber(candidate, 'Invalid id')

export const validateNumber = (candidate: string, errorMessage: string) => {
  if (!numberRegex.test(candidate)) {
    return errorMessage
  }
}

export const validateOptionalIdOnQueryString = (
  candidate: Request['query'][keyof Request['query']],
  errorMessage: string
) => {
  if (candidate === undefined) {
    return
  }

  if (!isString(candidate)) {
    return errorMessage
  }

  return validateIdNumber(candidate, errorMessage)
}

export const validateOptionalNumberOnQueryString = (
  candidate: Request['query'][keyof Request['query']],
  errorMessage: string
) => {
  if (candidate === undefined) {
    return
  }

  if (!isString(candidate)) {
    return errorMessage
  }

  return validateNumber(candidate, errorMessage)
}

export const validateYear = (candidate: Request['query'][keyof Request['query']]) => {
  if (!isString(candidate) || !yearRegex.test(candidate)) {
    return 'Invalid year'
  }
}
