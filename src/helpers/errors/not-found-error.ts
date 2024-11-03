export default class NotFoundError extends Error {
  statusCode: number
  errors: string[]

  constructor(entity: string) {
    super(`${entity} not found`)
    this.name = 'NotFoundError'
    this.statusCode = 404
    this.errors = [`${entity} not found`]
  }
}
