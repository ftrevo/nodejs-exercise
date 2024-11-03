import { sequelizeConnection } from '../db/config'
import { createAll, createPackageAndMunicipality } from '../../db/seed'
import priceService from './price.service'

beforeEach(async () => {
  await sequelizeConnection.sync({ force: true })
})

afterEach(() => {
  jest.useRealTimers()
})

afterAll(async () => {
  await sequelizeConnection.close()
})

describe('PriceService', () => {
  describe('getHistory', () => {
    it('Returns the prices for the provided year', async () => {
      const { basic, premium, stockholm, goteborg } = await createAll()

      const result = await priceService.getHistory({
        year: '2019',
      })

      expect(result).toStrictEqual({
        [basic.name]: {
          [goteborg.name]: [20_00],
          [stockholm.name]: [30_00],
        },
        [premium.name]: {
          [goteborg.name]: [200_00],
          [stockholm.name]: [300_00, 350_00],
        },
      })
    })

    it('Returns the prices for the provided package and year', async () => {
      const { basic, stockholm, goteborg } = await createAll()

      const result = await priceService.getHistory({
        year: '2020',
        packageId: basic.id,
      })

      expect(result).toStrictEqual({
        [basic.name]: {
          [goteborg.name]: [30_00],
          [stockholm.name]: [40_00],
        },
      })
    })

    it('Returns the prices for the provided municipality and year', async () => {
      const { basic, stockholm, premium } = await createAll()

      const result = await priceService.getHistory({
        year: '2020',
        municipalityId: stockholm.id,
      })

      expect(result).toStrictEqual({
        [basic.name]: {
          [stockholm.name]: [40_00],
        },
        [premium.name]: {
          [stockholm.name]: [400_00],
        },
      })
    })

    it('Returns the proces for the provided municipality, package and year', async () => {
      const { premium, goteborg } = await createAll()

      const result = await priceService.getHistory({
        year: '2019',
        packageId: premium.id,
        municipalityId: goteborg.id,
      })

      expect(result).toStrictEqual({
        [premium.name]: {
          [goteborg.name]: [200_00],
        },
      })
    })
  })

  describe('createOrUpratePrice', () => {
    const createdAtTime = new Date('1987-11-16T22:00:00.000Z')

    it('Returns the new price if none exists for the provided package and municipality', async () => {
      jest.useFakeTimers().setSystemTime(createdAtTime)

      const [{ goteborg }, { basic }] = await createPackageAndMunicipality()

      const createdPrice = await priceService.createOrUpdate({
        packageId: basic.id,
        municipalityId: goteborg.id,
        priceCents: 50_00,
      })

      if ('error' in createdPrice) {
        fail('Error in updatedPrice')
      }

      expect(createdPrice.priceCents).toEqual(50_00)
      expect(createdPrice.active).toEqual(true)
      expect(createdPrice.id).toBeGreaterThan(0)
      expect(createdPrice.municipalityId).toEqual(goteborg.id)
      expect(createdPrice.packageId).toEqual(basic.id)
      expect(createdPrice.createdAt).toEqual(createdAtTime)
      expect(createdPrice.updatedAt).toEqual(createdAtTime)
    })

    it('Returns the updated price if one exists for the provided package and municipality', async () => {
      jest.useFakeTimers().setSystemTime(createdAtTime)

      const [{ goteborg }, { basic }] = await createPackageAndMunicipality()

      await priceService.createOrUpdate({
        packageId: basic.id,
        municipalityId: goteborg.id,
        priceCents: 50_00,
      })

      const newCreatedAtTime = new Date('1987-11-16T23:00:00.000Z')
      jest.useFakeTimers().setSystemTime(newCreatedAtTime)

      const updatedPrice = await priceService.createOrUpdate({
        packageId: basic.id,
        municipalityId: goteborg.id,
        priceCents: 60_00,
      })

      if ('error' in updatedPrice) {
        fail('Error in updatedPrice')
      }

      expect(updatedPrice.priceCents).toEqual(60_00)
      expect(updatedPrice.active).toEqual(true)
      expect(updatedPrice.id).toBeGreaterThan(0)
      expect(updatedPrice.municipalityId).toEqual(goteborg.id)
      expect(updatedPrice.packageId).toEqual(basic.id)
      expect(updatedPrice.createdAt).toEqual(newCreatedAtTime)
      expect(updatedPrice.updatedAt).toEqual(newCreatedAtTime)
    })
  })

  describe('getActive', () => {
    it('Returns the active prices for the provided package', async () => {
      const { premium, stockholm, goteborg } = await createAll()

      const result = await priceService.getActive({
        packageId: premium.id,
      })

      expect(result).toStrictEqual({
        [premium.name]: {
          [goteborg.name]: [200_00],
          [stockholm.name]: [400_00],
        },
      })
    })

    it('Returns the active prices for the provided municipality', async () => {
      const { goteborg, basic, premium } = await createAll()

      const result = await priceService.getActive({
        municipalityId: goteborg.id,
      })

      expect(result).toEqual({
        [basic.name]: {
          [goteborg.name]: [30_00],
        },
        [premium.name]: {
          [goteborg.name]: [200_00],
        },
      })
    })

    it('Returns the active prices for both the provided package and municipality', async () => {
      const { basic, goteborg } = await createAll()

      const result = await priceService.getActive({
        packageId: basic.id,
        municipalityId: goteborg.id,
      })

      expect(result).toEqual({
        [basic.name]: {
          [goteborg.name]: [30_00],
        },
      })
    })

    it('Returns the active prices for all packages and municipalities', async () => {
      const { stockholm, goteborg, basic, premium } = await createAll()

      const result = await priceService.getActive({})

      expect(result).toEqual({
        [basic.name]: {
          [goteborg.name]: [30_00],
          [stockholm.name]: [40_00],
        },
        [premium.name]: {
          [goteborg.name]: [200_00],
          [stockholm.name]: [400_00],
        },
      })
    })
  })
})
