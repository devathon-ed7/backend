import jwt from "jsonwebtoken"

class Token {
  generate(payload) {
    throw new Error("Method not implented")
  }
  verify(token) {
    throw new Error("Method no implemented")
  }
}

class JWTToken extends Token {
  private jwt
  private secretKey

  constructor() {
    super()
    this.jwt = jwt
    this.secretKey =
      process.env.JWT_SECRET || "f645182c36ef0b9f86aede5a5c7b1eeb0ec7ccd3"
  }

  generate(payload: any) {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h"
    return (
      this.jwt.sign(payload, this.secretKey),
      {
        expiresIn: expiresIn
      }
    )
  }

  verify(token: string) {
    try {
      return this.jwt.verify(token, this.secretKey)
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

export default JWTToken
