import { sequelizeConnection } from '../db/config'
import { createPackages, createAll } from '../../db/seed'
import packageService from './package.service'

beforeEach(async () => {
  await sequelizeConnection.sync({ force: true })
})

afterAll(async () => {
  await sequelizeConnection.close()
})

describe('PackageService', () => {
  describe('getAll', () => {
    it('Returns all the packages', async () => {
      const { basic, premium } = await createPackages()

      const packages = await packageService.getAll({})

      expect(packages.length).toEqual(2)
      expect(packages[0].name).toEqual(basic.name)
      expect(packages[1].name).toEqual(premium.name)
    })

    it('Returns the packages given a specific limit and offset', async () => {
      const { premium } = await createPackages()

      const packages = await packageService.getAll({ limit: 1, offset: 1 })

      expect(packages.length).toEqual(1)
      expect(packages[0].name).toEqual(premium.name)
    })

    it('Returns an empty list if there are no packages', async () => {
      const packages = await packageService.getAll({})

      expect(packages.length).toEqual(0)
    })
  })

  describe('getDetails', () => {
    it('Returns the package with all its details', async () => {
      const { basic, goteborg, stockholm } = await createAll()

      const packageDetails = await packageService.getDetails({ id: basic.id })

      expect(packageDetails?.name).toEqual(basic.name)
      expect(packageDetails?.prices?.length).toEqual(4)
      expect(packageDetails?.prices?.[0]).toEqual(
        expect.objectContaining({
          priceCents: 20_00,
          active: false,
          municipality: expect.objectContaining({
            name: goteborg.name,
          }),
        })
      )
      expect(packageDetails?.prices?.[1]).toEqual(
        expect.objectContaining({
          priceCents: 30_00,
          active: false,
          municipality: expect.objectContaining({
            name: stockholm.name,
          }),
        })
      )
      expect(packageDetails?.prices?.[2]).toEqual(
        expect.objectContaining({
          priceCents: 30_00,
          active: true,
          municipality: expect.objectContaining({
            name: goteborg.name,
          }),
        })
      )
      expect(packageDetails?.prices?.[3]).toEqual(
        expect.objectContaining({
          priceCents: 40_00,
          active: true,
          municipality: expect.objectContaining({
            name: stockholm.name,
          }),
        })
      )
    })

    it('Throw not found exception when no package is found', async () => {
      try {
        await packageService.getDetails({
          id: 2345678,
        })
        fail('should have thrown an error')
      } catch (error: any) {
        expect(error.message).toEqual('Package not found')
      }
    })
  })

  describe('create', () => {
    it('Returns the new package', async () => {
      const packageName = 'New Package'

      const newPackage = await packageService.create({ name: packageName })

      expect(newPackage.name).toEqual(packageName)
    })
  })

  describe('update', () => {
    it('Returns the updated package', async () => {
      const { basic } = await createPackages()
      const newPackageName = 'Updated basic package'

      const updatedPackage = await packageService.update({
        id: basic.id,
        name: newPackageName,
      })

      expect(updatedPackage.name).toEqual(newPackageName)
    })

    it('Throw not found exception when no package is found', async () => {
      try {
        await packageService.update({
          id: 2345678,
          name: 'Updated Package',
        })
        fail('should have thrown an error')
      } catch (error: any) {
        expect(error.message).toEqual('Package not found')
      }
    })
  })
})
