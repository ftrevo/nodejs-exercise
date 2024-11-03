import type { NextFunction, Request, Response } from 'express'
import MunicipalityService from '../services/municipality.service'
import {
  validateCreateRequest,
  validateDetailsRequest,
  validateGetAllRequest,
  validateUpdateRequest,
} from '../validators/shared'

export default {
  async getAll(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateGetAllRequest(request)

      const municipalities = await MunicipalityService.getAll(payload)

      response.send(municipalities)
    } catch (error) {
      next(error)
    }
  },

  async getDetails(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateDetailsRequest(request)

      const municipalityDetail = await MunicipalityService.getDetails(payload)

      response.send(municipalityDetail)
    } catch (error) {
      next(error)
    }
  },

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateCreateRequest(request)

      const newMunicipality = await MunicipalityService.create(payload)

      response.status(201).send(newMunicipality)
    } catch (error) {
      next(error)
    }
  },

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const payload = validateUpdateRequest(request)

      const updatedMunicipality = await MunicipalityService.update(payload)

      response.send(updatedMunicipality)
    } catch (error) {
      next(error)
    }
  },
}
