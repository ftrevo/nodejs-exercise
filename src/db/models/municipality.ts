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

export class Municipality extends Model<InferAttributes<Municipality>, InferCreationAttributes<Municipality>> {
  declare static associations: {
    prices: Association<Municipality, Price>
  }

  declare prices?: NonAttribute<Price[]>

  declare id: CreationOptional<number>
  declare name: string
}

Municipality.init(
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
        name: 'Municipality_name',
        msg: 'Municipality already exists',
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
