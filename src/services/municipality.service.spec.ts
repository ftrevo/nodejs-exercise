import { sequelizeConnection } from '../db/config'
import { createMunicipalities, createAll } from '../../db/seed'
import municipalityService from './municipality.service'

beforeEach(async () => {
  await sequelizeConnection.sync({ force: true })
})

afterAll(async () => {
  await sequelizeConnection.close()
})

describe('MunicipalityService', () => {
  describe('getAll', () => {
    it('Returns all the municipalities', async () => {
      const { goteborg, stockholm } = await createMunicipalities()

      const municipalities = await municipalityService.getAll({})

      expect(municipalities.length).toEqual(2)
      expect(municipalities[0].name).toEqual(goteborg.name)
      expect(municipalities[1].name).toEqual(stockholm.name)
    })

    it('Returns the municipality given a specific limit and offset', async () => {
      const { goteborg } = await createMunicipalities()

      const municipalities = await municipalityService.getAll({
        limit: 1,
        offset: 0,
      })

      expect(municipalities.length).toEqual(1)
      expect(municipalities[0].name).toEqual(goteborg.name)
    })

    it('Returns an empty list if there are no municipalities', async () => {
      const municipalities = await municipalityService.getAll({})

      expect(municipalities.length).toEqual(0)
    })
  })

  describe('getDetails', () => {
    it('Returns the municipality with all its details', async () => {
      const { premium, basic, stockholm } = await createAll()

      const municipalityDetails = await municipalityService.getDetails({
        id: stockholm.id,
      })

      expect(municipalityDetails?.name).toEqual(stockholm.name)
      expect(municipalityDetails?.prices?.length).toEqual(5)
      expect(municipalityDetails?.prices?.[0]).toEqual(
        expect.objectContaining({
          priceCents: 30_00,
          active: false,
          package: expect.objectContaining({
            name: basic.name,
          }),
        })
      )
      expect(municipalityDetails?.prices?.[1]).toEqual(
        expect.objectContaining({
          priceCents: 300_00,
          active: false,
          package: expect.objectContaining({
            name: premium.name,
          }),
        })
      )
      expect(municipalityDetails?.prices?.[2]).toEqual(
        expect.objectContaining({
          priceCents: 350_00,
          active: false,
          package: expect.objectContaining({
            name: premium.name,
          }),
        })
      )
      expect(municipalityDetails?.prices?.[3]).toEqual(
        expect.objectContaining({
          priceCents: 40_00,
          active: true,
          package: expect.objectContaining({
            name: basic.name,
          }),
        })
      )
      expect(municipalityDetails?.prices?.[4]).toEqual(
        expect.objectContaining({
          priceCents: 400_00,
          active: true,
          package: expect.objectContaining({
            name: premium.name,
          }),
        })
      )
    })

    it('Throw not found exception when no municipality is found', async () => {
      try {
        await municipalityService.getDetails({
          id: 2345678,
        })
        fail('should have thrown an error')
      } catch (error: any) {
        expect(error.message).toEqual('Municipality not found')
      }
    })
  })

  describe('create', () => {
    it('Returns the created municipality', async () => {
      const municipality = await municipalityService.create({
        name: 'Malmo',
      })

      expect(municipality.name).toEqual('Malmo')
    })
  })

  describe('update', () => {
    it('Returns the updated municipality', async () => {
      const { stockholm } = await createMunicipalities()

      const newName = 'Estocolmo'

      const updatedMunicipality = await municipalityService.update({
        id: stockholm.id,
        name: newName,
      })

      expect(updatedMunicipality.name).toEqual(newName)
    })

    it('Throw not found exception when no municipality is found', async () => {
      try {
        await municipalityService.update({
          id: 2345678,
          name: 'Stockholm',
        })
        fail('should have thrown an error')
      } catch (error: any) {
        expect(error.message).toEqual('Municipality not found')
      }
    })
  })
})
