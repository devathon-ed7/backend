export class CustomError extends Error {
  constructor(message: string, name: string) {
    super(message)
    this.name = name
  }
  static Unauthorized(message: string): CustomError {
    return new CustomError(message, "Unauthorized")
  }

  static NotFound(message: string): CustomError {
    return new CustomError(message, "NotFound")
  }

  static BadRequest(message: string): CustomError {
    return new CustomError(message, "BadRequest")
  }
}

export function createCustomError(message: string, name: string): CustomError {
  return new CustomError(message, name)
}
