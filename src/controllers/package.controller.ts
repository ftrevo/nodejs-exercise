import type { Request, Response, NextFunction } from 'express'
import {
  validateCreateRequest,
  validateDetailsRequest,
  validateGetAllRequest,
  validateUpdateRequest,
} from '../validators/shared'
import PackageService from '../services/package.service'

export default {
  async getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateGetAllRequest(request)

      const packages = await PackageService.getAll(payload)

      response.send(packages)
    } catch (error) {
      next(error)
    }
  },

  async getDetails(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateDetailsRequest(request)

      const packageDetail = await PackageService.getDetails(payload)

      response.send(packageDetail)
    } catch (error) {
      next(error)
    }
  },

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateCreateRequest(request)

      const newPackage = await PackageService.create(payload)

      response.status(201).send(newPackage)
    } catch (error) {
      next(error)
    }
  },

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateUpdateRequest(request)

      const updatedPackage = await PackageService.update(payload)

      response.send(updatedPackage)
    } catch (error) {
      next(error)
    }
  },
}
