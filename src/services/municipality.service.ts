import { Municipality } from '../db/models/municipality'
import { Package } from '../db/models/package'
import { Price } from '../db/models/price'
import NotFoundError from '../helpers/errors/not-found-error'
import { isNotNil } from '../helpers/utils'

export default {
  async getAll({ limit, offset }: { limit?: number; offset?: number }) {
    return Municipality.findAll({
      order: [['name', 'ASC']],
      ...(limit && { limit }),
      ...(isNotNil(offset) && { offset }),
    })
  },

  async getDetails({ id }: { id: number }) {
    const existingMunicipality = await Municipality.findByPk(id, {
      include: [
        {
          model: Price,
          required: false,
          as: 'prices',
          include: [
            {
              model: Package,
              required: false,
              attributes: ['name'],
              as: 'package',
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
          { model: Package, as: 'package' },
          'name',
          'ASC',
        ],
      ],
    })

    if (existingMunicipality) {
      return existingMunicipality
    }

    throw new NotFoundError('Municipality')
  },

  async create({ name }: { name: string }) {
    return Municipality.create({
      name,
    })
  },

  async update({ id, name }: { id: number; name: string }) {
    const existingMunicipality = await Municipality.findByPk(id)

    if (existingMunicipality) {
      return existingMunicipality.update({ name })
    }

    throw new NotFoundError('Municipality')
  },
}
