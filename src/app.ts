import process from 'node:process'
import express from 'express'
import cors from 'cors'
import { createAll } from '../db/seed'
import { defineAppRoutes } from './routes'
import { errorHandler } from './middlewares/error-handler'
import { notFoundMiddleware } from './middlewares/not-found'
import { sequelizeConnection } from './db/config'

export const app = express()

app.use(express.json())
app.use(
  cors({
    credentials: true,
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS'],
  })
)
app.disable('x-powered-by')

sequelizeConnection.authenticate().then(() => {
  console.log('Authentication with the database as successfull')

  if (process.env.NODE_ENV !== 'production') {
    sequelizeConnection.sync({ force: true }).then(() => {
      console.log('Connected to the database on non production mode')

      if (process.env.DB_SEED === 'true') {
        createAll().then(() => {
          console.log('Database seeded')
        })
      }
    })
  }
})

defineAppRoutes(app)

app.use(notFoundMiddleware)
app.use(errorHandler)
