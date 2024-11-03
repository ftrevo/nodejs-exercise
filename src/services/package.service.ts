import { Municipality } from '../db/models/municipality'
import { Package } from '../db/models/package'
import { Price } from '../db/models/price'
import NotFoundError from '../helpers/errors/not-found-error'
import { isNotNil } from '../helpers/utils'

export default {
  async getAll({ limit, offset }: { limit?: number; offset?: number }) {
    return Package.findAll({
      order: [['name', 'ASC']],
      ...(limit && { limit }),
      ...(isNotNil(offset) && { offset }),
    })
  },

  async getDetails({ id }: { id: number }) {
    const existingPackage = await Package.findByPk(id, {
      include: [
        {
          model: Price,
          required: false,
          as: 'prices',
          include: [
            {
              model: Municipality,
              required: false,
              attributes: ['name'],
              as: 'municipality',
            },
          ],
        },
      ],
      order: [
        [
          {
            model: Price,
            as: 'prices',
          },
          'createdAt',
          'ASC',
        ],
        [
          {
            model: Price,
            as: 'prices',
          },
          { model: Municipality, as: 'municipality' },
          'name',
          'ASC',
        ],
      ],
    })

    if (existingPackage) {
      return existingPackage
    }

    throw new NotFoundError('Package')
  },

  async create({ name }: { name: string }) {
    return Package.create({
      name,
    })
  },

  async update({ id, name }: { id: number; name: string }) {
    const existingPackage = await Package.findByPk(id)

    if (existingPackage) {
      return existingPackage.update({ name })
    }

    throw new NotFoundError('Package')
  },
}
