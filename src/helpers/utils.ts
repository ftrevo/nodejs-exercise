import type { Price } from '../db/models/price'

export const isString = (candidate: any): candidate is string => typeof candidate === 'string'

export const isNotNil = (toBeChecked?: number | null) => toBeChecked !== null && toBeChecked !== undefined

export const priceReducer = (priceList: Price[]) =>
  priceList.reduce(
    (accumulator, price) => {
      const municipalityName = price.municipality.name
      const packageName = price.package.name

      accumulator[packageName] ||= {}
      accumulator[packageName][municipalityName] ||= []

      accumulator[packageName][municipalityName].push(price.priceCents)

      return accumulator
    },
    {} as Record<string, Record<string, number[]>>
  )
