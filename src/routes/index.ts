import type { Application } from 'express'
import MunicipalityRoutes from './municipality.routes'
import PackageRoutes from './package.routes'
import PriceRoutes from './price.routes'

export const defineAppRoutes = (app: Application) => {
  app.use('/api/package', PackageRoutes)
  app.use('/api/price', PriceRoutes)
  app.use('/api/municipality', MunicipalityRoutes)
}
