import {
  validateIdNumber,
  validateId,
  validateNumber,
  validateOptionalIdOnQueryString,
  validateOptionalNumberOnQueryString,
  validateYear,
} from './validations'

describe('validations', () => {
  describe('validateIdNumber', () => {
    it('should return error message for invalid id', () => {
      const result = validateIdNumber('invalid-id', 'Invalid id')
      expect(result).toBe('Invalid id')
    })

    it('should return undefined for valid id', () => {
      const result = validateIdNumber('12345', 'Invalid id')
      expect(result).toBeUndefined()
    })
  })

  describe('validateId', () => {
    it('should return error message for invalid id', () => {
      const result = validateId('invalid-id')
      expect(result).toBe('Invalid id')
    })

    it('should return undefined for valid id', () => {
      const result = validateId('12345')
      expect(result).toBeUndefined()
    })
  })

  describe('validateNumber', () => {
    it('should return error message for invalid number', () => {
      const result = validateNumber('invalid-number', 'Invalid number')
      expect(result).toBe('Invalid number')
    })

    it('should return undefined for valid number', () => {
      const result = validateNumber('12345', 'Invalid number')
      expect(result).toBeUndefined()
    })
  })

  describe('validateOptionalIdOnQueryString', () => {
    it('should return undefined for undefined candidate', () => {
      const result = validateOptionalIdOnQueryString(undefined, 'Invalid id')
      expect(result).toBeUndefined()
    })

    it('should return error message for non-string candidate', () => {
      const result = validateOptionalIdOnQueryString(['12345'], 'Invalid id')
      expect(result).toBe('Invalid id')
    })

    it('should return error message for invalid id', () => {
      const result = validateOptionalIdOnQueryString('invalid-id', 'Invalid id')
      expect(result).toBe('Invalid id')
    })

    it('should return undefined for valid id', () => {
      const result = validateOptionalIdOnQueryString('12345', 'Invalid id')
      expect(result).toBeUndefined()
    })
  })

  describe('validateOptionalNumberOnQueryString', () => {
    it('should return undefined for undefined candidate', () => {
      const result = validateOptionalNumberOnQueryString(undefined, 'Invalid number')
      expect(result).toBeUndefined()
    })

    it('should return error message for non-string candidate', () => {
      const result = validateOptionalNumberOnQueryString(['12345'], 'Invalid number')
      expect(result).toBe('Invalid number')
    })

    it('should return error message for invalid number', () => {
      const result = validateOptionalNumberOnQueryString('invalid-number', 'Invalid number')
      expect(result).toBe('Invalid number')
    })

    it('should return undefined for valid number', () => {
      const result = validateOptionalNumberOnQueryString('12345', 'Invalid number')
      expect(result).toBeUndefined()
    })
  })

  describe('validateYear', () => {
    it('should return error message for invalid year', () => {
      const result = validateYear('invalid-year')
      expect(result).toBe('Invalid year')
    })

    it('should return undefined for valid year', () => {
      const result = validateYear('2023')
      expect(result).toBeUndefined()
    })
  })
})
