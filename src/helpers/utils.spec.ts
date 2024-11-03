import type { Price } from '../db/models/price'
import { isString, isNotNil, priceReducer } from './utils'

describe('utils', () => {
  test('isString', () => {
    expect(isString('test')).toBe(true)
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
  })

  test('isNotNil', () => {
    expect(isNotNil(123)).toBe(true)
    expect(isNotNil(null)).toBe(false)
    expect(isNotNil(undefined)).toBe(false)
  })

  describe('priceReducer', () => {
    const mockPrices = [
      {
        municipality: { name: 'Municipality1' },
        package: { name: 'PackageA' },
        priceCents: 1000,
      },
      {
        municipality: { name: 'Municipality1' },
        package: { name: 'PackageA' },
        priceCents: 1500,
      },
      {
        municipality: { name: 'Municipality2' },
        package: { name: 'PackageB' },
        priceCents: 2000,
      },
    ] as Price[]

    test('should correctly reduce prices by package and municipality', () => {
      const result = priceReducer(mockPrices)

      expect(result).toEqual({
        PackageA: {
          Municipality1: [1000, 1500],
        },
        PackageB: {
          Municipality2: [2000],
        },
      })
    })

    test('should handle empty price list', () => {
      const result = priceReducer([])
      expect(result).toEqual({})
    })
  })
})
