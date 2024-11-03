import type { Request } from 'express'
import ValidationError from '../helpers/errors/validation-error'
import { validateCreatePriceRequest, validateGetActiveRequest, validateGetHistoryRequest } from './price'

describe('price validators', () => {
  describe('validateCreatePriceRequest', () => {
    it('should throw ValidationError if priceCents is invalid', () => {
      const request = {
        body: {
          priceCents: 'invalid-price',
          packageId: '123',
          municipalityId: '456',
        },
      } as Request

      expect(() => validateCreatePriceRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if packageId is invalid', () => {
      const request = {
        body: {
          priceCents: '1000',
          packageId: 'invalid-package-id',
          municipalityId: '456',
        },
      } as Request

      expect(() => validateCreatePriceRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if municipalityId is invalid', () => {
      const request = {
        body: {
          priceCents: '1000',
          packageId: '123',
          municipalityId: 'invalid-municipality-id',
        },
      } as Request

      expect(() => validateCreatePriceRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if multiple fields are invalid', () => {
      const request = {
        body: {
          priceCents: 'invalid-price',
          packageId: 'invalid-package-id',
          municipalityId: 'invalid-municipality-id',
        },
      } as Request

      expect(() => validateCreatePriceRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized payload if all fields are valid', () => {
      const request = {
        body: {
          priceCents: '1000',
          packageId: '123',
          municipalityId: '456',
          extra: 'ignored-param',
        },
      } as Request

      const result = validateCreatePriceRequest(request)

      expect(result).toEqual({
        priceCents: 10_00,
        packageId: 123,
        municipalityId: 456,
      })
    })
  })

  describe('validateGetActiveRequest', () => {
    it('should throw ValidationError if packageId is invalid', () => {
      const request = {
        query: { packageId: 'invalid-package-id', municipalityId: '456' },
      } as any as Request

      expect(() => validateGetActiveRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if municipalityId is invalid', () => {
      const request = {
        query: { packageId: '123', municipalityId: 'invalid-municipality-id' },
      } as any as Request

      expect(() => validateGetActiveRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if both packageId and municipalityId are invalid', () => {
      const request = {
        query: {
          packageId: 'invalid-package-id',
          municipalityId: 'invalid-municipality-id',
        },
      } as any as Request

      expect(() => validateGetActiveRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized params if both packageId and municipalityId are valid', () => {
      const request = {
        query: {
          packageId: '123',
          municipalityId: '456',
          extra: 'ignored-param',
        },
      } as any as Request

      const result = validateGetActiveRequest(request)
      expect(result).toEqual({ packageId: 123, municipalityId: 456 })
    })
  })

  describe('validateGetHistoryRequest', () => {
    it('should throw ValidationError if packageId is invalid', () => {
      const request = {
        query: {
          packageId: 'invalid-package-id',
          municipalityId: '456',
          year: '2023',
        },
      } as any as Request

      expect(() => validateGetHistoryRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if municipalityId is invalid', () => {
      const request = {
        query: {
          packageId: '123',
          municipalityId: 'invalid-municipality-id',
          year: '2023',
        },
      } as any as Request

      expect(() => validateGetHistoryRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if year is invalid', () => {
      const request = {
        query: {
          packageId: '123',
          municipalityId: '456',
          year: 'invalid-year',
        },
      } as any as Request

      expect(() => validateGetHistoryRequest(request)).toThrow(ValidationError)
    })

    it('should throw ValidationError if multiple fields are invalid', () => {
      const request = {
        query: {
          packageId: 'invalid-package-id',
          municipalityId: 'invalid-municipality-id',
          year: 'invalid-year',
        },
      } as any as Request

      expect(() => validateGetHistoryRequest(request)).toThrow(ValidationError)
    })

    it('should return sanitized query parameters if all fields are valid', () => {
      const request = {
        query: {
          packageId: '123',
          municipalityId: '456',
          year: '2023',
          extra: 'ignored-param',
        },
      } as any as Request

      const result = validateGetHistoryRequest(request)
      expect(result).toEqual({
        packageId: 123,
        municipalityId: 456,
        year: '2023',
      })
    })
  })
})
