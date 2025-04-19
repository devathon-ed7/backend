import jwt from "jsonwebtoken";

interface Payload {
  [key: string]: string | number | boolean
}
interface IToken {
  generate(payload: Payload): string;
  verify(token: string): Payload;
}
class JWTToken implements IToken {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET_KEY as string;
  }


  generate(payload: Payload): string {
    const expiresIn = process.env.JWT_EXPIRES_IN || "24h";
    return jwt.sign(payload, this.secretKey, { expiresIn });
  }

  verify(token: string): Payload {
    try {
      return jwt.verify(token, this.secretKey) as Payload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }
}

export default JWTToken
