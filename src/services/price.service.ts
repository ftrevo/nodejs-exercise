import { Sequelize, Op } from 'sequelize'
import { Municipality } from '../db/models/municipality'
import { Package } from '../db/models/package'
import { Price } from '../db/models/price'
import { sequelizeConnection } from '../db/config'
import { isNotNil, priceReducer } from '../helpers/utils'

export default {
  async getHistory({ year, packageId, municipalityId }: { year: string; packageId?: number; municipalityId?: number }) {
    const prices = await Price.findAll({
      where: {
        [Op.and]: [
          {
            ...(isNotNil(packageId) && { packageId }),
            ...(isNotNil(municipalityId) && { municipalityId }),
          },
          Sequelize.where(Sequelize.fn('strftime', '%Y', Sequelize.col('Price.createdAt')), year),
        ],
      },
      include: [
        {
          model: Municipality,
          required: true,
          attributes: ['name'],
          as: 'municipality',
        },
        {
          model: Package,
          required: true,
          attributes: ['name'],
          as: 'package',
        },
      ],
      order: [['updatedAt', 'ASC']],
    })

    return priceReducer(prices)
  },

  async getActive({ packageId, municipalityId }: { packageId?: number; municipalityId?: number }) {
    const activePrices = await Price.findAll({
      where: {
        ...(isNotNil(packageId) && { packageId }),
        ...(isNotNil(municipalityId) && { municipalityId }),
        active: true,
      },
      include: [
        {
          model: Municipality,
          required: true,
          attributes: ['name'],
          as: 'municipality',
        },
        {
          model: Package,
          required: true,
          attributes: ['name'],
          as: 'package',
        },
      ],
      order: [['updatedAt', 'ASC']],
    })

    return priceReducer(activePrices)
  },

  async createOrUpdate({
    packageId,
    priceCents,
    municipalityId,
  }: {
    packageId: number
    priceCents: number
    municipalityId: number
  }) {
    const newPrice = await sequelizeConnection.transaction(async (t) => {
      const existingActivePrice = await Price.findOne({
        where: { packageId, municipalityId, active: true },
      })

      if (existingActivePrice) {
        existingActivePrice.active = false
        await existingActivePrice.save({ transaction: t })
      }

      const newActivePrice = await Price.create(
        {
          packageId,
          priceCents,
          municipalityId,
        },
        { transaction: t }
      )

      return newActivePrice.save({ transaction: t })
    })

    return newPrice
  },
}
