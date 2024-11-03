export default class ValidationError extends Error {
  statusCode: number
  errors: string[]

  constructor(errors: string[] = []) {
    super('Validation failed')
    this.name = 'ValidationError'
    this.statusCode = 400
    this.errors = errors
  }
}
