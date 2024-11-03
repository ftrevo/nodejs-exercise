import type { Request, Response, NextFunction } from 'express'
import PriceService from '../services/price.service'
import { validateCreatePriceRequest, validateGetActiveRequest, validateGetHistoryRequest } from '../validators/price'

export default {
  async getHistory(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateGetHistoryRequest(request)

      const history = await PriceService.getHistory(payload)

      response.send(history)
    } catch (error) {
      next(error)
    }
  },

  async getActive(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateGetActiveRequest(request)

      const activePrices = await PriceService.getActive(payload)

      response.send(activePrices)
    } catch (error) {
      next(error)
    }
  },

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateCreatePriceRequest(request)

      const newPrice = await PriceService.createOrUpdate(payload)

      response.status(201).send(newPrice)
    } catch (error) {
      next(error)
    }
  },
}
