import process from 'node:process'
import { Sequelize } from 'sequelize'

export const sequelizeConnection = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH,
  logging: process.env.DB_LOGS_ENABLED === 'true',
  pool: {
    max: process.env.DB_POOL_MAX ? Number.parseInt(process.env.DB_POOL_MAX, 10) : 5,
    min: process.env.DB_POOL_MIN ? Number.parseInt(process.env.DB_POOL_MIN, 10) : 0,
    idle: process.env.DB_POOL_IDLE ? Number.parseInt(process.env.DB_POOL_IDLE, 10) : 10000,
  },
})
