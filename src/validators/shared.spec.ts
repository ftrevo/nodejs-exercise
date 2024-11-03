import type { Request } from 'express'
import ValidationError from '../helpers/errors/validation-error'
import { validateCreateRequest, validateDetailsRequest, validateGetAllRequest, validateUpdateRequest } from './shared'

describe('shared validators', () => {
  describe('validateCreateRequest', () => {
    it('should throw ValidationError if name is invalid', () => {
      const request = {
        body: { name: '' },
      } as Request

      expect(() => validateCreateRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized params if trimmed name is valid', () => {
      const request = {
        body: { name: '  valid name  ', extra: 'ignored-param' },
      } as Request

      const result = validateCreateRequest(request)
      expect(result).toEqual({ name: 'valid name' })
    })
  })

  describe('validateUpdateRequest', () => {
    it('should throw ValidationError if id is invalid', () => {
      const request = {
        params: { id: 'invalid-id' },
        body: { name: 'valid name' },
      } as any as Request

      expect(() => validateUpdateRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if name is invalid', () => {
      const request = {
        params: { id: '123' },
        body: { name: '   ' },
      } as any as Request

      expect(() => validateUpdateRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized payload if id and trimmed name are valid', () => {
      const request = {
        params: { id: '123' },
        body: { name: '  valid name  ', extra: 'ignored-param' },
      } as any as Request

      const result = validateUpdateRequest(request)
      expect(result).toEqual({ id: 123, name: 'valid name' })
    })
  })

  describe('validateGetAllRequest', () => {
    it('should throw ValidationError if limit is invalid', () => {
      const request = {
        query: { limit: 'invalid-id' },
      } as any as Request

      expect(() => validateGetAllRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if offset is invalid', () => {
      const request = {
        query: { offset: 'invalid-number' },
      } as any as Request

      expect(() => validateGetAllRequest(request)).toThrow(ValidationError)
    })

    it('should return empty object if limit and offset are not present', () => {
      const request = {
        query: { extra: 'ignored-param' },
      } as any as Request

      const result = validateGetAllRequest(request)
      expect(result).toEqual({})
    })

    it('should return sanitized parameters if limit and offset are valid', () => {
      const request = {
        query: { limit: '123', offset: '456', extra: 'ignored-param' },
      } as any as Request

      const result = validateGetAllRequest(request)
      expect(result).toEqual({ limit: 123, offset: 456 })
    })
  })

  describe('validateDetailsRequest', () => {
    it('should throw ValidationError if id is invalid', () => {
      const request = {
        params: { id: 'invalid-id' },
      } as any as Request

      expect(() => validateDetailsRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized payload if id is valid', () => {
      const request = {
        params: { id: '123', extra: 'ignored-param' },
      } as any as Request

      const result = validateDetailsRequest(request)
      expect(result).toEqual({ id: 123 })
    })
  })
})
