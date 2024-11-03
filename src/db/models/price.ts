import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelizeConnection } from '../config'
import { Package } from './package'
import { Municipality } from './municipality'

export class Price extends Model<InferAttributes<Price>, InferCreationAttributes<Price>> {
  declare id: CreationOptional<number>
  declare priceCents: number
  declare active: CreationOptional<boolean>

  declare packageId: ForeignKey<Package['id']>
  declare package: NonAttribute<Package>

  declare municipalityId: ForeignKey<Municipality['id']>
  declare municipality: NonAttribute<Municipality>

  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

Price.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    priceCents: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Invalid price',
        },
        min: {
          args: [0],
          msg: 'Price must be positive',
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize: sequelizeConnection,
  }
)

Price.belongsTo(Package, {
  foreignKey: 'packageId',
  as: 'package',
})

Package.hasMany(Price, {
  sourceKey: 'id',
  foreignKey: { name: 'packageId' },
  as: 'prices',
})

Price.belongsTo(Municipality, {
  foreignKey: 'municipalityId',
  as: 'municipality',
})

Municipality.hasMany(Price, {
  sourceKey: 'id',
  foreignKey: { name: 'municipalityId' },
  as: 'prices',
})
