import {
  DataTypes,
  Model,
  type Association,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type NonAttribute,
} from 'sequelize'
import { sequelizeConnection } from '../config'
import { nameRegex } from '../../helpers/constants'
import type { Price } from './price'

export class Package extends Model<InferAttributes<Package>, InferCreationAttributes<Package>> {
  declare static associations: {
    prices: Association<Package, Price>
  }

  declare prices?: NonAttribute<Price[]>

  declare id: CreationOptional<number>
  declare name: string
}

Package.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        name: 'Package_name',
        msg: 'Package already exists',
      },
      validate: {
        is: {
          args: nameRegex,
          msg: 'Invalid name',
        },
        max: {
          args: [255],
          msg: 'Name is too long',
        },
      },
    },
  },
  {
    sequelize: sequelizeConnection,
    timestamps: false,
  }
)
