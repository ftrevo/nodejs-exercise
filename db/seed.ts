import { sequelizeConnection } from '../src/db/config'
import { Municipality } from '../src/db/models/municipality'
import { Package } from '../src/db/models/package'

export const createPackages = async () => {
  const [basic, premium] = await Promise.all([Package.create({ name: 'basic' }), Package.create({ name: 'premium' })])

  return {
    basic: {
      id: basic.id,
      name: basic.name,
    },
    premium: {
      id: premium.id,
      name: premium.name,
    },
  }
}

export const createMunicipalities = async () => {
  const [stockholm, goteborg] = await Promise.all([
    Municipality.create({ name: 'Stockholm' }),
    Municipality.create({ name: 'Göteborg' }),
  ])
  return {
    stockholm: {
      id: stockholm.id,
      name: stockholm.name,
    },
    goteborg: {
      id: goteborg.id,
      name: goteborg.name,
    },
  }
}

export const createPackageAndMunicipality = async () => Promise.all([createMunicipalities(), createPackages()])

export const createAll = async () => {
  const [{ goteborg, stockholm }, { basic, premium }] = await createPackageAndMunicipality()

  const qi = sequelizeConnection.getQueryInterface()

  await qi.bulkInsert('Prices', [
    {
      priceCents: 20_00,
      packageId: basic.id,
      municipalityId: goteborg.id,
      createdAt: new Date('2019-01-01'),
      updatedAt: new Date('2020-01-01'),
      active: false,
    },
    {
      priceCents: 200_00,
      packageId: premium.id,
      municipalityId: goteborg.id,
      createdAt: new Date('2019-01-01'),
      updatedAt: new Date('2019-01-01'),
      active: true,
    },
    {
      priceCents: 30_00,
      packageId: basic.id,
      municipalityId: goteborg.id,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      active: true,
    },
    {
      priceCents: 30_00,
      packageId: basic.id,
      municipalityId: stockholm.id,
      createdAt: new Date('2019-01-01'),
      updatedAt: new Date('2020-01-01'),
      active: false,
    },
    {
      priceCents: 300_00,
      packageId: premium.id,
      municipalityId: stockholm.id,
      createdAt: new Date('2019-01-01'),
      updatedAt: new Date('2019-06-15'),
      active: false,
    },
    {
      priceCents: 350_00,
      packageId: premium.id,
      municipalityId: stockholm.id,
      createdAt: new Date('2019-06-15'),
      updatedAt: new Date('2020-01-01'),
      active: false,
    },
    {
      priceCents: 40_00,
      packageId: basic.id,
      municipalityId: stockholm.id,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      active: true,
    },
    {
      priceCents: 400_00,
      packageId: premium.id,
      municipalityId: stockholm.id,
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2020-01-01'),
      active: true,
    },
  ])

  return {
    basic,
    premium,
    stockholm,
    goteborg,
  }
}
