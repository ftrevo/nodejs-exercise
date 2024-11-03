import type { NextFunction, Request, Response } from 'express'
import * as validations from '../validators/shared'
import municipalityService from '../services/municipality.service'
import municipalityController from './municipality.controller'

/*
 * I've decided not to refactor the controller and services to add an injection pattern due to the time constraint.
 * Due to this, there is a lot of manual mocks here :(
 *
 * And I,ve also decided to only test this controller and partialy due to the time constraint as well, since the other tests and controllers tests would be very similar.
 */

jest.mock('../validators/shared', () => ({
  validateGetAllRequest: jest.fn().mockImplementation((input) => {
    if (input.query.limit === 100) {
      throw new Error('Random Validation Error')
    }

    return { limit: input.query.limit, offset: input.query.offset }
  }),
  validateDetailsRequest: jest.fn().mockImplementation((input) => {
    if (input.params.id === 100) {
      throw new Error('Random Validation Error')
    }

    return { id: input.params.id }
  }),
}))

jest.mock('../services/municipality.service', () => ({
  getAll: jest.fn().mockImplementation((input) => {
    if (input.limit === 101) {
      throw new Error('Random Service Error')
    }

    return [{ name: 'Goteborg', id: 1 }]
  }),
  getDetails: jest.fn().mockImplementation((input) => {
    if (input.id === 101) {
      throw new Error('Random Service Error')
    }

    return { id: input.id, name: 'Goteborg', prices: [] }
  }),
}))

beforeAll(() => {
  jest.clearAllMocks()
})

afterAll(() => {
  jest.restoreAllMocks()
})

describe('MunicipalityController', () => {
  describe('getAll', () => {
    it('should call response.send with received data from service.getAll', async () => {
      const request = {
        query: { limit: 1, offset: 1 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getAll(request, response, next)

      expect(validations.validateGetAllRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getAll).toHaveBeenCalledWith(request.query)
      expect(response.send).toHaveBeenCalledWith([{ name: 'Goteborg', id: 1 }])
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error from validation.validateGetAllRequest', async () => {
      const request = {
        query: { limit: 100, offset: 1 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getAll(request, response, next)

      expect(validations.validateGetAllRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getAll).not.toHaveBeenCalledWith()
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Random Validation Error' }))
    })

    it('should call next with error from service.getAll', async () => {
      const request = {
        query: { limit: 101, offset: 1 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getAll(request, response, next)

      expect(validations.validateGetAllRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getAll).toHaveBeenCalledWith(request.query)
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Random Service Error' }))
    })
  })

  describe('getDetails', () => {
    it('should call response.send with received data from service.getDetails', async () => {
      const request = {
        params: { id: 1 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getDetails(request, response, next)

      expect(validations.validateDetailsRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getDetails).toHaveBeenCalledWith({
        id: request.params.id,
      })
      expect(response.send).toHaveBeenCalledWith({
        id: 1,
        name: 'Goteborg',
        prices: [],
      })
      expect(next).not.toHaveBeenCalled()
    })

    it('should call next with error from validation.validateDetailsRequest', async () => {
      const request = {
        params: { id: 100 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getDetails(request, response, next)

      expect(validations.validateDetailsRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getDetails).not.toHaveBeenCalledWith()
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Random Validation Error' }))
    })

    it('should call next with error from service.getDetails', async () => {
      const request = {
        params: { id: 101 },
      } as any as Request
      const response = { send: jest.fn() } as any as Response
      const next = jest.fn() as any as NextFunction

      await municipalityController.getDetails(request, response, next)

      expect(validations.validateDetailsRequest).toHaveBeenCalledWith(request)
      expect(municipalityService.getDetails).toHaveBeenCalledWith({
        id: request.params.id,
      })
      expect(response.send).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: 'Random Service Error' }))
    })
  })
})
